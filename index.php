<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Simplify - Limit Yourself</title>
	<link href="simplify.css" media="screen" rel="stylesheet" type="text/css" />
	<meta http-equiv="X-UA-Compatible" content="chrome=1" />
	<meta name="description" content="A list tracker for the 100 Thing challenge initiated by Dave Bruno." />

<!-- Google Analytics init -->
<script type="text/javascript">
  var _gaq = _gaq || [];
	_gaq.push(
  	["_setAccount", "UA-9377034-1"],
  	["_setDomain", ".foont.net"],
  	["_trackPageview"]
	);
</script>
</head>
<body>
	<ul id="linkbar">
		<li><a href="#">Login</a></li>
		<li><a href="#">Help</a></li>
		<li><a href="#">About</a></li>
	</ul>

	<h1>simplify</h1>
	<h3>limit yourself</h3>

	<h4 class="thing_count" id="top"><span>0 Things</span></h4>
	<div id="list_container">
		<img src="images/ajax-loader.gif" title="Loading Things" alt="Loading Things" />
	</div>
	<h4 class="thing_count" id="bottom"><span>0 Things</span></h4>

	<!-- Get our scripts in order.  not optimized yet obviously -->
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/mootools/1.2.4/mootools-yui-compressed.js"></script>
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
