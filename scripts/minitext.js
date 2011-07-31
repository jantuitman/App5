App5.module('minitext',function (globals) {

	function MiniText() {
	  this.imgPrefix='';
	}


	MiniText.prototype.MODE_BEGIN_BLOCK = 0; //we are at the start of a block
	MiniText.prototype.MODE_CODE = 1; //we are within code.
	MiniText.prototype.MODE_P = 3; //we are inside a texblock
	MiniText.prototype.MODE_IN_UL = 4 ;
	MiniText.prototype.MODE_IN_OL =5 ; 
	MiniText.prototype.MODE_TABLE = 6;
	MiniText.prototype.MODE_BLOCKQUOTE = 7;

	/*

	Human markup to HTML translator
	18-NOV-2007

	++ a modeless operator 
	
	"""      turns blockquote on/off. works in MODE_BEGINBLOCK, MODE_P. 

	++ Block codes 
	
	A block code must start at the beginning of a line.

	+       header 1
	++      header 2
	+++     header 3
	-       item of bulleted list
	#       item of numbered list
	|       a table, each cell ends with |
	<<<     code, all markup is ignored and fixed with font is used
	>>>
	(##text) tree node. This point receives a target and an index
	        to all tree nodes is generated at the top of the
	        document. Two ## is the outermost level and each # indents
	        one level more, e.g. (#####text)  (TODO)

	++ Inline codes
	
	An inline code may appear within text.

	**   ** bold
	__  __  italic
	``  ``  inline code (no markup and fixed width font)
	[.] [x] check box (TODO)
	"text":(url)      hyperlink
	"text":(#url)     local hyperlink
	(#text) a target for a hyperlink 
	"imageURL":url  image       (TODO)
	[[  ]]  all markup is ignored

	Everything else is text. If a text ends with an empty line, it
	becomes an alinea (or paragraph). Within an alinea a single \n
	generates an HTML <br> (line break).

	*/


	MiniText.prototype.setImgPrefix=function(value) {
		this.imgPrefix=value;
	}

	MiniText.prototype.process=function(content) {
		this.output="";

		content=content.replace(/\r\n/g,"\n");
		this.mode=this.MODE_BEGIN_BLOCK;

		var lines=content.split("\n");
		for(var lc=0;lc<lines.length;lc++) {
			var line=lines[lc];
	        if (this.mode==this.MODE_IN_UL) {
	           if (line.length>0 && line.charAt(0) == '-')
	           {
				   this.processListLine(line);
	           }
			   else
			   {
				   this.changeListLevel(0);
				   this.mode=this.MODE_BEGIN_BLOCK;
			   }
			}
	        if (this.mode==this.MODE_IN_OL) {
	           if (line.length>0 && line.charAt(0) == '#')
	           {
				   this.processListLine(line);
	           }
			   else
			   {
				   this.changeListLevel(0);
				   this.mode=this.MODE_BEGIN_BLOCK;
			   }
	 		}
	        if (this.mode==this.MODE_TABLE) {
	           if (line.length>0 && line.charAt(0) == '|')
	           {
				   this.processTableLine(line);
	           }
			   else
			   {
				   this.appendBlock("</table>");
				   this.mode=this.MODE_BEGIN_BLOCK;
			   }
	 		}
			if (this.mode==this.MODE_BEGIN_BLOCK)
			{
				// do nothing if the line is empty
				if (line.match(/^\s*$/))
				{
					// do nothing.
				}
				else
				{
					var foundMode=false;
					var startChar=line.charAt(0);
					if (startChar=='+')
					{
						foundMode=true;
						this.mode=this.MODE_BEGIN_BLOCK; // unchanged by a heading, because the following line is again a new block.
						line.match(/^(\++)/);
						var j=RegExp.$1.length;
						this.appendBlock("<h"+j+">"+this.inline(line.substr(j))+"</h"+j+">");
					}
					else if (startChar=='#')
					{
						foundMode=true;
						this.mode=this.MODE_IN_OL;
						this.processListLine(line);
					}
					else if (startChar=='-')
					{
						foundMode=true;
						this.mode=this.MODE_IN_UL;
						this.processListLine(line);
					}
					else if (startChar=='|')
					{
						foundMode=true;
						this.mode=this.MODE_TABLE;
						this.appendBlock('<table class="styled">');
						this.processTableLine(line);
					}
					else if (startChar=='<')
					{
						if (line.match(/^<<</))
						{
							foundMode=true;
							this.mode=this.MODE_CODE;
							this.appendBlock("<code><pre>"+this.replaceHtml(line.substr(3)));
						}
					}
					else if (startChar=='"')
					{
						if (line=='"""')
						{
							foundMode=true;
							this.mode=this.MODE_P;
							this.P_open=false;
	                        // a blockquote may contain several alinea's and other block elements. 
							// therefore the mode  is just MODE_P, with the variable this.P_open set to false so that there will not be an </p> tag.
							// meanwhile the registration if we are in or out a blockquote is in a variable this.blockQuotes.
							if (this.blockQuotes)
							{
								this.appendBlock("</blockquote>");
								this.blockQuotes=false;
							}
							else
							{
								this.appendBlock("<blockquote>");
								this.blockQuotes=true;
							}

						}
					}
					if (!foundMode)
					{
						this.mode=this.MODE_P;
						this.appendLine('<p>'+this.inline(line));
						this.P_open=true;
					}
				}
			}
			else if (this.mode==this.MODE_CODE)
			{
				if(!line.match(/^>>>/))
				{
					this.appendBlock(this.replaceHtml(line));
				}
				else
				{
					this.appendBlock("</pre></code>");
					this.mode=this.MODE_BEGIN_BLOCK;
				}
			}
			else if (this.mode==this.MODE_P)
			{
	            //a white line is needed to stop the alinea.
				//but you can toggle blockquote inside a P.
	            if (line.match(/^\s*$/))
	            {
					if (this.P_open)
					{
						this.appendBlock('</p>');
						this.P_open=false;
					}
					//probably different with perl?
					this.mode=this.MODE_BEGIN_BLOCK;
	            }
				// difference with perl version: we close a P if it is still open before blockquote gets closed.
				else if (line.match('"""'))
				{
					if (this.P_open)
					{
						this.appendBlock('</p>');
					}
					if (this.blockQuotes)
					{
						this.appendBlock("</blockquote>");
						this.blockQuotes=true;
					}
					else
					{
						this.appendBlock("<blockquote>");
						this.blockQuotes=true;
					}
					mode=this.MODE_BEGIN_BLOCK;
					this.P_open=false;
				}
				else
				{
					this.appendLine(this.inline(line));
				}
			}
		} // end foreach line.

		// close open blocks
	    if (this.mode==this.MODE_IN_UL || this.mode==this.MODE_IN_OL) this.changeListLevel(0);
		if (this.mode==this.MODE_TABLE) this.appendBlock("</table>");
		if (this.mode==this.MODE_CODE) this.appendBlock("</pre></code>");
		if (this.mode==this.MODE_P) { 
			if (this.P_open)
			{
				this.appendBlock("</p>");
			}
		}
		if (this.blockQuotes)
		{
			this.appendBlock("</blockquote>");
		}
	    return this.output;
	}


	// to do: not sure if this works with an empty string. | followed by nothing.
	// to do: normalize td's ?
	MiniText.prototype.processTableLine=function(line)
	{
		var result='<tr><td>';
		var s=line.substr(1);
	    while(s.match(/\[\[/)) {
	        s=RegExp.rightContext;
			var a=this.replaceCodes(RegExp.leftContext);
			a=a.replace(/\|/g,'</td><td>');
			result+=a;
			if (s.match(/\]\]/))
			{
				s=RegExp.rightContext;
	            result+=this.replaceHtml(RegExp.leftContext);
			}
		}
		var a=this.replaceCodes(s);
		// replace all pipes that are not on the end of the string with </td><td>
		a=a.replace(/\|(?!$)/g,'</td><td>');
		// remove end pipe.
		a=a.replace(/\|$/,'');
		result+=a;
		this.appendBlock(result+"</td></tr>");
	}


	MiniText.prototype.processListLine=function(line)
	{
		var listChar=this.listChar();
		var re=new RegExp("^("+listChar+"+)");
		var j=0;
		var s='';
		if (line.match(re))
		{
			j=RegExp.$1.length;
		}
		s=RegExp.rightContext;
		this.changeListLevel(j);
	    this.appendBlock("<li>"+this.inline(s)+"</li>"); 
	}


	MiniText.prototype.changeListLevel=function(newLevel)
	{
	   if(this.currentListLevel==null) this.currentListLevel=0;
	   if(newLevel>this.currentListLevel) {
			for(var j=this.currentListLevel;j<newLevel;j++)
			{
				this.appendBlock('<'+this.listName()+'>');
			}
	   }
	   else if (newLevel==this.currentListLevel)
	   {
		   // do nothing
	   }
	   else if (newLevel<this.currentListLevel)
	   {
		   for(var j=this.currentListLevel;j>newLevel;j--)
		   {
				this.appendBlock('</'+this.listName()+'>');
		   }
	   }
	   this.currentListLevel=newLevel;
	}

	MiniText.prototype.listName=function()
	{
		if (this.mode==this.MODE_IN_UL)
		{
			return "ul" ;
		}
		if (this.mode==this.MODE_IN_OL)
		{
			return "ol" ;
		}
		return "";
	}

	MiniText.prototype.listChar=function()
	{
		if (this.mode==this.MODE_IN_UL)
		{
			return "-" ;
		}
		if (this.mode==this.MODE_IN_OL)
		{
			return "#" ;
		}
		return "";
	}

	MiniText.prototype.inline=function(s)
	{
	    var result='';
		while(s.match(/\[\[/)) {
	        s=RegExp.rightContext;
			var a=this.replaceCodes(RegExp.leftContext);
			result+=a;
			if (s.match(/\]\]/))
			{
				s=RegExp.rightContext;
	            result+=this.replaceHtml(RegExp.leftContext);
			}
		}
		var a=this.replaceCodes(s);
	    result+=a;
	    return result;
	}

	MiniText.prototype.replaceCodes=function(s)
	{
		s=this.replaceHtml(s);
		s=s.replace(/__(.*?)__/g,"<i>$1</i>");
		s=s.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>");
		s=s.replace(/``(.*?)``/g,"<code>$1</code>");
		s=s.replace(/"ImageURL":(\S*)/g,'<img src="'+this.imgPrefix+'/$1" />');
		s=s.replace(/"(.*?)":\(#([^\)]*)\)/g,'<a href="#$2" >$1</a>');
		s=s.replace(/"(.*?)":\(([^\)]*)\)/g,'<a href="$2">$1</a>');
		s=s.replace(/\(#(.*?)\)/g,'<a name="$1">$1</a>');
		return s;
	}

	MiniText.prototype.replaceHtml=function(s)
	{
		s=s.replace(/&/g,"&amp;");
		s=s.replace(/</g,"&lt;");
		s=s.replace(/>/g,"&gt;");
		return s;
	}

	MiniText.prototype.appendLine=function(s)
	{
		if (this.lineBuffer==null)
		{
			this.lineBuffer=s;
		}
		else
		{
			this.output+=this.lineBuffer+"<br/>\n";
			this.lineBuffer=s;
		}
	}

	MiniText.prototype.appendBlock=function(s)
	{
		if (this.lineBuffer!=null)
		{
			this.output+=this.lineBuffer;
			this.lineBuffer=null;
		}
		this.output+=s+"\n";
	}
	
	
	var m=new MiniText();
	
	globals.process=function (content) {
		return m.process(content);
	}
	
	return globals;
});