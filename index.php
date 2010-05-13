<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Simplify - Limit Yourself</title>
	<link href="simplify.css" media="screen" rel="stylesheet" type="text/css" />
	<meta name="google-site-verification" content="NioKFsvpTKEZ8AYfp95aIHW2jHWe-uiOSJszfA4IcZY" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="chrome=1" />
	<meta name="description" content="A list tracker for the 100 Thing challenge initiated by Dave Bruno." />

<!-- Google Analytics init -->
<script type="text/javascript">
   var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-9377034-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })(); 
</script>
</head>
<body>
	<div id="details">
		<ul id="linkbar">
			<li><a href="#login">Login</a></li>
			<li><a href="#help">Help</a></li>
			<li><a href="#about">About</a></li>
		</ul>
		<div id="expanded_details">
			<div class="content" id="login">Creating a user account is not enabled yet.  Don't worry, the list still saves without an account.</div>
			<div class="content" id="help"><b>I can't find my list!</b><br />Make sure you are using the same browser as when you created it.</div>
			<div class="content" id="about">I first encountered this concept on <a href="http://mnmlist.com/50-things/">mnmlist.com</a>, and I was intrigued by the concept that not only could I survive with only 100 possessions, but that my life might be richer for it.  I'm looking forward to eliminating some of the junk I have accumulated over the years. Leo is down to 50 items! (100 will be tough enough for me right now)</div>
		</div>
		<ul id="footer">
			<li>Created By Brian Ramsay</li>		
			<li><a href="http://mootools.net">MooTools</a></li>
			<li><a href="http://pablotron.org/?cid=1557">Persist.js</a></li>
		</ul>
	</div>

	<h1>simplify</h1>
	<h3>limit yourself</h3>

	<p class="tips" id="empty_explanation"></p>

	<h4 class="thing_count" id="top"><span>0 Things</span></h4>
	<div id="list_container">
		<img src="images/ajax-loader.gif" title="Loading Things" alt="Loading Things" />
	</div>
	<h4 class="thing_count" id="bottom"><span>0 Things</span></h4>

	<p class="tips">
		Hit Enter and Escape to save and cancel items.
	</p>

	<!-- Get our scripts in order.  not optimized yet obviously -->
	<script type="text/javascript" src="mootools.js"></script>
	<script type="text/javascript" src="simplify.js"></script>
	<script type="text/javascript" src="persist-all-min.js"></script>
	<script type="text/javascript">
		$(window).addEvent("domready", function() {
			var store = new Persist.Store("Simplify");
			simplify.init(store);
		});
	</script>
</body>
</html>
