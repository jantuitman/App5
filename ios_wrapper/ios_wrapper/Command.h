//
//  Command.h
//  nbsipad
//
//  Created by Jan Tuitman on 5/13/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void (^CallbackType)(id object);

@protocol Command <NSObject>

- (void) execute: (NSArray*) params andCallback: (CallbackType) callback ;
@end
