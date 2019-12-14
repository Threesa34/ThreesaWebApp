// Generated by CoffeeScript 1.9.3
(function() {
  var buildStack, content, exit, i, json, len, options, page, paper, ref, ref1, ref2, ref3, setContent, system, timeout, totalPages, type, vp, webpage;

  system = require('system');

  webpage = require('webpage');

  exit = function(error) {
    var message;
    if (typeof error === 'string') {
      message = error;
    }
    if (error) {
      system.stderr.write("html-pdf: " + (message || ("Unknown Error " + error)) + "\n");
    }
    return phantom.exit(error ? 1 : 0);
  };

  buildStack = function(msg, trace) {
    var msgStack;
    msgStack = [msg];
    if (trace != null ? trace.length : void 0) {
      msgStack.push('Stack:');
      trace.forEach(function(t) {
        return msgStack.push("  at " + (t.file || t.sourceURL) + ": " + t.line + " (in function " + t["function"] + ")");
      });
    }
    return msgStack.join('\n');
  };

  phantom.onError = function(msg, trace) {
    return exit(buildStack('Script - ' + msg, trace));
  };

  json = JSON.parse(system.stdin.readLine());

  if (!((ref = json.html) != null ? ref.trim() : void 0)) {
    exit('Did not receive any html');
  }

  options = json.options;

  page = webpage.create();

  page.content = json.html;

  if (vp = options.viewportSize) {
    page.viewportSize = vp;
  }

  totalPages = 0;

  page.onError = function(msg, trace) {
    return exit(buildStack('Evaluation - ' + msg, trace));
  };

  if (timeout = json.options.timeout) {
    timeout = timeout + 2000;
  }

  setTimeout(function() {
    return exit('Force timeout');
  }, timeout || 12000);

  content = page.evaluate(function() {
    var $body, $footer, $header, body, footer, header, styles;
    styles = document.querySelectorAll('link,style');
    styles = Array.prototype.reduce.call(styles, (function(string, node) {
      return string + node.outerHTML;
    }), '');
    if ($header = document.getElementById('pageHeader')) {
      header = $header.outerHTML;
      $header.parentNode.removeChild($header);
    }
    if ($footer = document.getElementById('pageFooter')) {
      footer = $footer.outerHTML;
      $footer.parentNode.removeChild($footer);
    }
    if ($body = document.getElementById('pageContent')) {
      body = $body.outerHTML;
    } else {
      body = document.body.outerHTML;
    }
    return {
      styles: styles,
      header: header,
      body: body,
      footer: footer
    };
  });

  paper = {
    border: options.border || '0'
  };

  if (options.height && options.width) {
    paper.width = options.width;
    paper.height = options.height;
  } else {
    paper.format = options.format || 'A4';
    paper.orientation = options.orientation || 'portrait';
  }

  setContent = function(type) {
    var ref1;
    return paper[type] = {
      height: (ref1 = options[type]) != null ? ref1.height : void 0,
      contents: phantom.callback(function(pageNum, numPages) {
        var ref2;
        return (((ref2 = options[type]) != null ? ref2.contents : void 0) || content[type] || '').replace('{{page}}', pageNum).replace('{{pages}}', numPages) + content.styles;
      })
    };
  };

  ref1 = ['header', 'footer'];
  for (i = 0, len = ref1.length; i < len; i++) {
    type = ref1[i];
    if (options[type] || content[type]) {
      setContent(type);
    }
  }

  if ((ref2 = paper.header) != null) {
    if (ref2.height == null) {
      ref2.height = '46mm';
    }
  }

  if ((ref3 = paper.footer) != null) {
    if (ref3.height == null) {
      ref3.height = '28mm';
    }
  }

  page.paperSize = paper;

  page.onLoadFinished = function(status) {
    var fileOptions, filename;
    fileOptions = {
      type: options.type || 'pdf',
      quality: options.quality || 75
    };
    filename = options.filename || ((options.directory || '/tmp') + "/html-pdf-" + system.pid + "." + fileOptions.type);
    page.render(filename, fileOptions);
    system.stdout.write(JSON.stringify({
      filename: filename
    }));
    return exit(null);
  };

}).call(this);