# Library-Detector-Gound-Truth-Verificator
This is a tool to evaluate how good a evalutor extension is
Current feature includes:
- Dynamically insertion of cdn dependencies
- nodeJS dependencies can be specified in package.json and will only be count into ground truth if used
- Generation of site that uses the specified dependencies in package.json and dep-option.json


# Setup
```
# this sets up the dependecies for this codebase
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