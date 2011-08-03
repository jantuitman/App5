//
//  JSONSerializer.m
//  ios_wrapper
//
//  Created by Jan Tuitman on 8/3/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "JSONSerializer.h"

@implementation JSONSerializer

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
    }
    
    return self;
}

+(NSString*) serialize:(id)object {
    
    NSMutableString* str= [[NSMutableString alloc] init ];
    if ([object isKindOfClass: [NSArray class]] ) {
        [str appendString: @"["];
        int count=0;
        for (id el in (NSArray*) object) {
            [str appendString: [JSONSerializer serialize: el]];
            count++;
            if (count < [(NSArray*) object count]) [str appendString: @","] ;
        }
        [str appendString: @"]"];
    }
    else if ([object isKindOfClass:[NSNumber class]] ) {
        [str appendString : [(NSNumber*) object stringValue ]];
    }
    else if ([object isKindOfClass: [NSDictionary class]]) {
        NSEnumerator *enumerator = [(NSDictionary*) object keyEnumerator];
        id key;
        int count=0;
        while ((key = [enumerator nextObject])) {
            [str appendString: @"{"];
            /* code that uses the returned key */
            [str appendString: [JSONSerializer serializeString: (NSString*) key]];
            [str appendString: @" :"];
            [str appendString: [JSONSerializer serialize: [(NSDictionary*) object objectForKey:key] ]];
            count++;
            if (count < [(NSArray*) object count]) [str appendString: @","] ;
        }
        [str appendString: @"}"];
        
        
    }
    else if ([object isKindOfClass: [NSString class]]) {
        [str appendString: [JSONSerializer serializeString:(NSString*) object]];
    }
    else {
        @throw [NSException exceptionWithName:@"JSON Serializing Error"
                                       reason:@"Unknown type to serialize."
                                     userInfo:nil];
        
    }
    
    return str;
}

+(NSString*) serializeString: (NSString*) value {
    NSMutableString* result=[[NSMutableString alloc ] init ];
    [result appendString: @" '"];
    [result appendString: [[value stringByReplacingOccurrencesOfString:@"\\" withString: @"\\\\"] 
                           stringByReplacingOccurrencesOfString:@"'" withString:@"\\'"
                           ]];
    [result appendString: @"'"];
    return result;
    
}

@end
