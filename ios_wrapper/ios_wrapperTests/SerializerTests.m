//
//  SerializerTests.m
//  ios_wrapper
//
//  Created by Jan Tuitman on 8/3/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "SerializerTests.h"

@implementation SerializerTests

// All code under test must be linked into the Unit Test bundle
- (void)testSerialization
{
    NSArray* a = [[NSArray alloc] initWithObjects:@"aaa",[NSNumber numberWithInt:1], nil];
    NSDictionary* d = [[NSDictionary alloc] initWithObjectsAndKeys:a, @"arr", nil
                       
                       ];
    
    NSLog(@"%@",[JSONSerializer serialize:d]);
    STAssertTrue([[JSONSerializer serialize:d] isEqualToString: @"{ 'arr' :[ 'aaa',1]}" ],@" json serializer not working!");
}


@end
