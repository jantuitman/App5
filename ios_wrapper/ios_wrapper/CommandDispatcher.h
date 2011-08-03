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
- (void) processCommand: (NSString*) json forView: (UIWebView*) webview;
   
@end
