//
//  ios_wrapperViewController.h
//  ios_wrapper
//
//  Created by Jan Tuitman on 7/31/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CommandDispatcher.h"

@interface ios_wrapperViewController  : UIViewController  <UIWebViewDelegate> {
    __weak IBOutlet UIWebView *webView;
    CommandDispatcher *dispatcher;
}

@property(weak) UIWebView *webView;

@end

