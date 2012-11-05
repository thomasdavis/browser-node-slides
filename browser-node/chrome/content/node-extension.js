(function() {
    // Import Services module for Observer (startup and shutdown events)
    Components.utils.import("resource://gre/modules/Services.jsm");
       Application.console.log("Hello from my Firefox Extension!");

var id  = "node-extension@rawkes.com";// The extension's id from install.rdf(i.e. <em:id>)
Components.utils.import("resource://gre/modules/AddonManager.jsm"); 
AddonManager.getAddonByID(id, function(addon) {
var addonLocation = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file.path;
        Application.console.log(addonLocation);


    // Create an nsILocalFile for the Node executable
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);  
    file.initWithPath(addonLocation + "/components/node");

    // Check for Node executable
    if (!file.exists()) {
        console.log('fuck');
        Application.console.log("dpes it exist!");
        // Node executable is missing
        return;
    };

    // Create an nsIProcess to manage the Node executable
    var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    process.init(file);

    var ObserverHandler = {
        // subject refers to the process nsIProcess object
        observe: function(subject, topic, data) {
            switch (topic) {
                // Process has finished running and closed
                case "process-finished":
                    Application.console.log('script never ran');
                    break;
                // Process failed to run
                    Application.console.log('process failed like fuck');
                case "process-failed":
                    break;
                case "quit-application-granted":
                    // Shut down any Node.js processes
                    process.kill();
                    break;
            };
        }
    };    
        console.log('fuck');

    // Run the Node process and observe for any changes
    var args = [addonLocation + "/server/app.js"];
    process.runAsync(args, args.length, ObserverHandler);
Application.console.log(process);
    Services.obs.addObserver(ObserverHandler, "quit-application-granted", false);
});
})();