# Library-Detector-Gound-Truth-Verificator
This is a tool to evaluate how good a evalutor extension is
Current feature includes:
- Dynamically insertion of cdn dependencies
- Generation of site that uses the specified dependencies in package.json and dep-option.json
- NodeJS dependencies can be specified in package.json and will only be count into ground truth if used


# Setup
```
# This sets up the dependecies for this codebase
bash setup.sh
```

## Change the path to the extension
- In *browser-client-LDC/index.js*
    - change the `extensionPath` and `extensionId` to your LDC installation
    - change the `executablePath` on line 27 to the path to your Chrome browser
- Perform the same modification with the path of your PTdetector installation in *browser-client-PTdetector/index.js*

# Execute
```
bash visit.sh
bash visit.sh -l  # runs LDC
bash visit.sh -p  # runs LDC
```

# Experiment on different ground truths
There are two ways to change the ground truth:
1. Modify the *dep-option.json* file, feel free to make changes to the "cdn" object, the name for the packages should be identical to that of *jsdelivr.com*, for example, lodash will only work as `lodash` instead of `lo-dash`, or `lodash.js`

    - The keys listed here will automatically get transformed to a script tag in *index.html* with the right url source.
    - These source are included to the webpage via CDN import

2. You can also modify *package.json*, *index.js* and *index.html* files, the changes over here will be collected by webpack and get bundled into a dependecy file `main.js` (there could be other additional files). Only the dependency that is actually used will be counted into the ground truth, this is done with the help of webpack's *BundleAnalyzerPlugin* 