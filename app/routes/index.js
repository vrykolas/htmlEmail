
/*
 * GET home page.
 */

exports.index = function(req, res){
  var data = {
    title: "HTML eMail Builder",
    css: "",
    html: "",
    processedHtml: "",
    minifiedHtml: ""
  };

  if(req.session.data) {
    data.css = req.session.data.css;
    data.html = req.session.data.html;
    data.processedHtml = req.session.data.processedHtml;
    data.minifiedHtml = req.session.data.minifiedHtml;
  } else {
    var fs = require("fs");

    data.css = fs.readFileSync("app/assets/emailBoilerplate/email.css");
    data.html = fs.readFileSync("app/assets/emailBoilerplate/email.html");
  }

  res.render("index", data);
};

exports.process = function(req, res){
  var juice = require("juice"),
      htmlminify = require("html-minify").minify;

  var processedHtml = "",
      data = {
        css: "",
        html: "",
        processedHtml: ""
      },
      minifyOptions = {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true
      };

  if(req.body) {
    data = req.body;
  }

  data.processedHtml = juice.inlineContent(data.html, data.css);

console.log(htmlminify(data.processedHtml, minifyOptions));
  data.minifiedHtml = htmlminify(data.processedHtml, minifyOptions);

  req.session.data = data;
  res.redirect(302, "/");
};

exports.html = function(req, res){
  var html = "";

  if(req.session.data) {
    html = req.session.data.minifiedHtml;
  }

  res.send(200, html)
};
