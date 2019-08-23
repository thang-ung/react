<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xsl:output method="html" doctype-system="http://www.w3.org/TR/html4/strict.dtd"
		doctype-public="-//W3C//DTD HTML 4.01//EN" indent="yes" />

	<xsl:attribute-set name="css">
		<xsl:attribute name="rel">stylsheet</xsl:attribute>
		<xsl:attribute name="type">text/css</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="script">
		<xsl:attribute name="type">text/javascript</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="tr">
		<xsl:attribute name="name">jnullrow</xsl:attribute>
		<xsl:attribute name="style">display:none;</xsl:attribute>
		<xsl:attribute name="onclick">jed.click(this,event);</xsl:attribute>
	</xsl:attribute-set>

	<xsl:attribute-set name="th">
		<xsl:attribute name="unselectable">on</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jpopup">
		<xsl:attribute name="id">jpopup</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jheader">
		<xsl:attribute name="id">jheader</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jfocal">
		<xsl:attribute name="class">jfocal</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jflutton">
		<xsl:attribute name="type">image</xsl:attribute>
		<xsl:attribute name="tabindex">-14</xsl:attribute>
		<xsl:attribute name="hidefocus">true</xsl:attribute>
		<xsl:attribute name="tabindex">-1</xsl:attribute>
		<xsl:attribute name="src">../images/iju/square.png</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jstate">
		<xsl:attribute name="id">jstate</xsl:attribute>
		<xsl:attribute name="alt">ims</xsl:attribute>
		<xsl:attribute name="title">configuration</xsl:attribute>
		<xsl:attribute name="onclick">jed.IConfig.show(event);</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jstak">
		<xsl:attribute name="id">jstak</xsl:attribute>
		<xsl:attribute name="class">jstak</xsl:attribute>
		<xsl:attribute name="alt">im</xsl:attribute>
		<xsl:attribute name="title">stackling
+shift to enter in-place edit mode</xsl:attribute>
		<xsl:attribute name="onclick">jed.togglewrap(this,event);</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jdelete">
		<xsl:attribute name="id">jdelete</xsl:attribute>
		<xsl:attribute name="alt">del</xsl:attribute>
		<xsl:attribute name="title">delete entry</xsl:attribute>
		<xsl:attribute name="onclick">jed.rm(this,event);</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jplus">
		<xsl:attribute name="id">jplus</xsl:attribute>
		<xsl:attribute name="alt">undel</xsl:attribute>
		<xsl:attribute name="title">undelete entry</xsl:attribute>
		<xsl:attribute name="onclick">jed.unrm(this,event);</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="jblind">
		<xsl:attribute name="id">jblind</xsl:attribute>
		<xsl:attribute name="alt">lind</xsl:attribute>
		<xsl:attribute name="title">reveal/hide
adjacent
deleted row(s).</xsl:attribute>
		<xsl:attribute name="onclick">jed.blinder(this,event);</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="button">
		<xsl:attribute name="name">0</xsl:attribute>
		<xsl:attribute name="id">0</xsl:attribute>
		<xsl:attribute name="name">input</xsl:attribute>
		<xsl:attribute name="value">Save</xsl:attribute>
		<xsl:attribute name="onclick">jed.onSave(this,event,'demo')</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="em">
		<xsl:attribute name="class">nobr</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="date">
		<xsl:attribute name="alt">dl</xsl:attribute>
		<xsl:attribute name="type">date-local</xsl:attribute>
		<xsl:attribute name="class">jedate</xsl:attribute>
		<xsl:attribute name="value">$</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="pre">
		<xsl:attribute name="contentEditable">true</xsl:attribute>
		<xsl:attribute name="spellcheck">true</xsl:attribute>
		<xsl:attribute name="class">jedt</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="prewide">
		<xsl:attribute name="data-pw">prewide</xsl:attribute>
		<xsl:attribute name="contentEditable">true</xsl:attribute>
		<xsl:attribute name="spellcheck">true</xsl:attribute>
		<xsl:attribute name="class">jedt</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="text">
		<xsl:attribute name="type">text</xsl:attribute>
		<xsl:attribute name="spellcheck">true</xsl:attribute>
		<xsl:attribute name="pattern">[a-zA-Z]</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="number">
		<xsl:attribute name="type">number</xsl:attribute>
		<xsl:attribute name="pattern">[0-9]</xsl:attribute>
		<xsl:attribute name="format">#</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="checkcols">
		<xsl:attribute name="type">checkbox</xsl:attribute>
		<xsl:attribute name="tabindex">-63</xsl:attribute>
		<xsl:attribute name="onclick">jed.doChkCols(this)</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="checkbox">
		<xsl:attribute name="type">checkbox</xsl:attribute>
		<xsl:attribute name="tabindex">-63</xsl:attribute>
		<xsl:attribute name="onclick">jed.doChkSelect(this)</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="numeric">
		<xsl:attribute name="data-type">numeric</xsl:attribute>
		<xsl:attribute name="name">td</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="btn">
		<xsl:attribute name="alt">btn</xsl:attribute>
		<xsl:attribute name="type">button</xsl:attribute>
		<xsl:attribute name="class">btned</xsl:attribute>
		<xsl:attribute name="value">Edit</xsl:attribute>
		<xsl:attribute name="onclick">jed.rowEdit(this,event)</xsl:attribute>
	</xsl:attribute-set>
	<xsl:template match="/">
	<xsl:element name="html">
<head>
	<title>jeumCron</title>
	<link rel="stylesheet" type="text/css" href="../css/agf.css"/>

	<link rel="stylesheet" type="text/css" href="../css/jed5.css"/>
	<link rel="stylesheet" type="text/css" href="../css/chrome-radii.css"/>
	<link rel="stylesheet" type="text/css" href="../css/sizer.css"/>
	<link rel="stylesheet" type="text/css" href="../css/inplace.css"/>
	<link rel="stylesheet" type="text/css" href="../css/jsave.css"/>
	<link rel="stylesheet" type="text/css" href="../css/jconfig.css"/>
	<link rel="stylesheet" type="text/css" id="delvisual" href="../css/deletion-show.css"/>
	<link rel="stylesheet" type="text/css" id="colour" href="../css/colour-bu.css"/>
	<link rel="stylesheet" type="text/css" href="../css/presentation.css"/>
	<link rel="stylesheet" type="text/css" id="jlayout" href="../css/presentLayout.css"/>

	<script type="text/javascript" src="../jlib/cprototype.js">.</script>
	<script type="text/javascript" src="../jlib/csyncollection.js">.</script>
	<script type="text/javascript" src="../jlib/cnav.js">.</script>
	<script type="text/javascript" src="../jlib/cjex.js">.</script>
	<script type="text/javascript" src="../jlib/cfade.js">.</script>
	<script type="text/javascript" src="../jlib/cfixocal.js">.</script>
	<script type="text/javascript" src="../jlib/jedwind.js">.</script>
	<script type="text/javascript" src="../jlib/jeddrig.js">.</script>
	<script type="text/javascript" src="../jlib/cscrill.js">.</script>
	<script type="text/javascript" src="../jlib/cdirt.js">.</script>
	<script type="text/javascript" src="../jlib/csizer.js">.</script>
	<script type="text/javascript" src="../jlib/csweet.js">.</script>
	<script type="text/javascript" src="../jlib/csave.js">.</script>
	<script type="text/javascript" src="../jlib/cconfig.js">.</script>
	<script type="text/javascript" src="../jlib/onjed.js">.</script>
	<script type="text/javascript" src="../jlib/msie.js">.</script>
	<script type="text/javascript" src="../jlib/cpresent.js">.</script>
	<script type="text/javascript" src="../jlib/cjung.js">.</script>
	<script type="text/javascript" src="../jlib/cnest.js">.</script>
	<script type="text/javascript" src="../jlib/cjed.js">.</script>
	<script type="text/javascript" src="../jlib/jed5.js">.</script>
</head>
	<xsl:element name="body">
		<xsl:attribute name="onload">jedload();</xsl:attribute>
		<table>
		<xsl:for-each select="//entry">
			<tr onclick="jed.click(this,event);">
			<xsl:if test="position() mod 2 =0">
				<xsl:attribute name="data-r">1</xsl:attribute>
			</xsl:if>
				<td><em class="nobr"><xsl:element name="input" use-attribute-sets="btn"/><xsl:value-of select="position()+1"/></em></td>
			</tr>
		</xsl:for-each>
		</table>
		<xsl:element name="input" use-attribute-sets="jflutton jstate"/>
		<xsl:element name="input" use-attribute-sets="jflutton jblind"/>
		<xsl:element name="input" use-attribute-sets="jflutton jdelete"/>
		<xsl:element name="input" use-attribute-sets="jflutton jdelete"/>
		<xsl:element name="input" use-attribute-sets="jflutton jplus"/>
		<xsl:element name="div" use-attribute-sets="jpopup"/>
	</xsl:element>
	</xsl:element>
	</xsl:template>
</xsl:stylesheet>
