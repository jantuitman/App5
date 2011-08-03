//
//  CmdSettings.m
//  nbsipad
//
//  Created by Jan Tuitman on 5/21/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "CmdSettings.h"


@implementation CmdSettings


- (void) execute:(NSArray *)params andCallback:(CallbackType )callback {
    
    NSString *path = [[NSBundle mainBundle] bundlePath];
    NSString *finalPath = [path stringByAppendingPathComponent:@"settings_debug.plist"];
    NSMutableDictionary* plistDict = [[NSMutableDictionary alloc] initWithContentsOfFile:finalPath];
    
    NSLog(@"in settings %@", plistDict);
    
    callback(plistDict);
}

@end
