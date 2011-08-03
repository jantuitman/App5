//
//  ios_wrapperViewController.m
//  ios_wrapper
//
//  Created by Jan Tuitman on 7/31/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "ios_wrapperViewController.h"

@implementation ios_wrapperViewController

@synthesize webView;

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    [cookieStorage setCookieAcceptPolicy: NSHTTPCookieAcceptPolicyAlways]; 
    
	
	NSString *urlAddress = [[NSBundle mainBundle] pathForResource:@"index"ofType:@"html" inDirectory:@"www"  ];
	
	NSLog(@"View did load! %@",urlAddress);
	
	//Create a URL object.
	NSURL *url = [NSURL fileURLWithPath:urlAddress];
	NSLog(@"and url = %@",url);
	
	webView.delegate = self;
	
	
	//URL Requst Object
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:20.0];
	//Load the request in the UIWebView.
	[webView loadRequest:requestObj];
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
    self.webView = nil;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
}

- (void)viewWillDisappear:(BOOL)animated
{
	[super viewWillDisappear:animated];
}

- (void)viewDidDisappear:(BOOL)animated
{
	[super viewDidDisappear:animated];
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        return (interfaceOrientation != UIInterfaceOrientationPortraitUpsideDown);
    } else {
        return YES;
    }
}

/** delegate methods for webview */
- (void)webViewDidStartLoad:(UIWebView *)theWebView {
	NSLog(@"loading stuf...");
}


/**
 Called when the webview finishes loading.  
 */
- (void)webViewDidFinishLoad:(UIWebView *)theWebView {
	NSLog(@"Finished loading!");
	[[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
}


/**
 * Fail Loading With Error
 * Error - If the webpage failed to load display an error with the reson.
 *
 */
- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"Failed to load webpage with error: %@", [error localizedDescription]);
	/*
	 if ([error code] != NSURLErrorCancelled)
	 alert([error localizedDescription]);
     */
}

/**
 * check if url can be handled by application
 */
- (BOOL)webView:(UIWebView *)theWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
	NSURL *url = [request URL];
    NSString *urlString = [url absoluteString ];
	//NSLog(@"URL %@", [url description]);	
    /*
     * If a URL is being loaded that's a local file URL, just load it internally
     */
    if ([url isFileURL])
    {
        //NSLog(@"File URL %@", [url description]);
        return YES;
    }
    
    if ([urlString hasPrefix:@"command://"]) {
        
        
        urlString = [urlString substringFromIndex:10 ];
        [dispatcher processCommand:urlString forView:theWebView]; 
        
        return NO;
    }
    
    if ([urlString hasPrefix:@"http://localhost/"]) {
        
        return YES;
    }
    
    
    /*
     * We don't have a AncientCities or local file request, load it in the main Safari browser.
     */
    //NSLog(@"Unknown URL %@", [url description]);
    [[UIApplication sharedApplication] openURL:url];
    return NO;
	
}


@end
