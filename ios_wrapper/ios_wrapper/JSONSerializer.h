//
//  JSONSerializer.h
//  ios_wrapper
//
//  Created by Jan Tuitman on 8/3/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JSONSerializer : NSObject
    
+(NSString*) serialize: (id) object;
+(NSString*) serializeString: (NSString*) value;

@end
