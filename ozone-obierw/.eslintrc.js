module.exports = {
  'env': {
    'browser': false,
    'mocha': true,
    'node': true,
    'es6': true
  },
  'extends': 'airbnb-base',
  'rules': {
    'no-unused-vars': [
      'error',
      {
        'varsIgnorePattern': 'should|expect'
      }
    ],
    'quote-props': [
      'off'
    ],
    'no-trailing-spaces': [
      'off'
    ],
    'no-underscore-dangle': [
      'off'
    ],
    'spaced-comment': [
      'off'
    ],
    'comma-dangle': [
      'off'
    ],
    'linebreak-style': [
      'off'
    ],
    'no-param-reassign': [
      'off'
    ],    
    'max-len': [
      'error',
      { 'code': 200,
        'ignoreComments': true
      }
    ],

    'prefer-destructuring': ['off']
  }
};
