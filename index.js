'format cjs';

var engine = require('./engine');
var comitTypes = require('./types');
var configLoader = require('commitizen').configLoader;

var config = configLoader.load();

var externalDefaultOptions = {
  defaultType: 'NFF',
  defaultScope: "",        
  defaultSubject: "",
  defaultBody: "",
  defaultIssues: ""
};

var options = {
  types: comitTypes.types,
  defaultType: process.env.CZ_TYPE || config.defaultType || externalDefaultOptions.defaultType,
  defaultScope: process.env.CZ_SCOPE || config.defaultScope || externalDefaultOptions.defaultScope,
  defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject || externalDefaultOptions.defaultSubject,
  defaultBody: process.env.CZ_BODY || config.defaultBody || externalDefaultOptions.defaultBody,
  defaultIssues: process.env.CZ_ISSUES || config.defaultIssues || externalDefaultOptions.defaultIssues,
  disableScopeLowerCase:
    process.env.DISABLE_SCOPE_LOWERCASE || config.disableScopeLowerCase || externalDefaultOptions.disableScopeLowerCase,
  maxHeaderWidth:
    (process.env.CZ_MAX_HEADER_WIDTH &&
      parseInt(process.env.CZ_MAX_HEADER_WIDTH)) ||
    config.maxHeaderWidth ||
    100,
  maxLineWidth:
    (process.env.CZ_MAX_LINE_WIDTH &&
      parseInt(process.env.CZ_MAX_LINE_WIDTH)) ||
    config.maxLineWidth ||
    100
};

(function(options) {
  try {
    var commitlintLoad = require('@commitlint/load');
    commitlintLoad().then(function(clConfig) {
      if (clConfig.rules) {
        var maxHeaderLengthRule = clConfig.rules['header-max-length'];
        if (
          typeof maxHeaderLengthRule === 'object' &&
          maxHeaderLengthRule.length >= 3 &&
          !process.env.CZ_MAX_HEADER_WIDTH &&
          !config.maxHeaderWidth
        ) {
          options.maxHeaderWidth = maxHeaderLengthRule[2];
        }
      }
    });
  } catch (err) {}
})(options);

module.exports = engine(options);