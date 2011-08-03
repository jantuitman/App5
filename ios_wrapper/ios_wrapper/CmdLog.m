//
//  CmdLog.m
//  nbsipad
//
//  Created by Jan Tuitman on 5/13/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "CmdLog.h"


@implementation CmdLog

- (void) execute:(NSArray *)params andCallback:(CallbackType )callback {
    NSLog(@"%@",[params objectAtIndex:1]);
    callback(nil);
}

@end
