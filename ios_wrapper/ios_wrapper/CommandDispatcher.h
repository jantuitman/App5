//
//  CommandDispatcher.h
//  nbsipad
//
//  Created by Jan Tuitman on 5/11/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SZJsonParser.h"
#import "JSONSerializer.h"

@interface CommandDispatcher : NSObject {
    NSDictionary *commands;
}
// called by webview if a command is coming in from the javascript side. The command is looked up and the execute method will be called.
- (void) processCommand: (NSString*) json forView: (UIWebView*) webview;
// can be called by custom objective-c classes if an event must be passed through to javascript. 
- (void) postEvent: (NSString*) eventId withData: (NSDictionary*) data forView: (UIWebView*) webview;
   
@end
