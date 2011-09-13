//
//  CommandDispatcher.m
//  nbsipad
//
//  Created by Jan Tuitman on 5/11/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//
#import "Command.h" 
#import "CommandDispatcher.h"
#import "CmdLog.h" 
#import "CmdSettings.h"

@implementation CommandDispatcher

- init {
    
    commands= [NSDictionary dictionaryWithObjectsAndKeys: 
               [[CmdLog alloc] init] , @"log",
               [[CmdSettings alloc] init] , @"settings",
               nil 
               ];            
    return self;
}


- (void) processCommand: (NSString*) json forView: (UIWebView*) webview {
    
    
    NSRange data=[json rangeOfString: @"/" ];
    
    NSString *command=[json substringToIndex:data.location];
    NSString *arguments=[json substringFromIndex:data.location+1];
    NSString *result = [arguments stringByReplacingOccurrencesOfString:@"+" withString:@" "];
    result = [result stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    //NSLog(@"command %@",command);
    //NSLog(@"arguments (decoded, string) %@",result);
    NSArray *a = [result jsonObject];
    
    //NSLog(@"arguments %@",a);
    
    
    id c =  [ commands objectForKey:command];
    if ( c != nil) {
        NSNumber* callId=[a objectAtIndex:0] ;
        // TODO: block is on the stack for now, so real concurrent programming in the commands is still not possible.
        [c execute: a andCallback: ^(id object) {
            
            
            NSMutableDictionary* ret = (object==nil)? 
                [NSMutableDictionary dictionaryWithCapacity:1] : 
                 (NSMutableDictionary*) object;
            
            if (callId==nil) {
                NSLog(@"Unexpected null value for callid");
                [ret setObject:[NSNumber numberWithInt:1] forKey:@"id" ];
            }
            else {
                [ret setObject:callId forKey:@"id" ];
            }
            //CJSONSerializer* serializer = [CJSONSerializer serializer];
            

            NSString* retCall=[NSString stringWithFormat:@"%@%@%@"
                               , @"g_IOS_CALLER.receive_callback("
                               , [JSONSerializer serialize:ret]
                               , @")"
                               ];
            //NSLog(@"evaluating callback: %@",retCall);
            [webview stringByEvaluatingJavaScriptFromString: retCall];
            //NSLog(@"Back in callback, should pass arguments to browser now");
        }];
        
    }
}

- (void) postEvent:(NSString *)eventId withData:(NSDictionary *)data forView:(UIWebView *)webview {
        
    NSString* javaScript=[NSString stringWithFormat: @"App5.ios_postBack('%@',%@)" , eventId,[JSONSerializer serialize: data]];
    [webview stringByEvaluatingJavaScriptFromString: javaScript];
    
}


@end
