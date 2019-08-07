require("@babel/register")({
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
  ],
  "comments": true
});
require("./src");
