<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
                xmlns       ="http://www.alacra.com/"
                xmlns:a     ="http://www.alacra.com/"
                xmlns:xsl   ="http://www.w3.org/1999/XSL/Transform"
                xmlns:msxsl ="urn:schemas-microsoft-com:xslt"
                xmlns:js    ="http://www.alacra.com/ace/js"
                exclude-result-prefixes="msxsl a xsl js">

  <xsl:template name="make-cookie">
    <xsl:param name="always" select="false()"/>
    <xsl:param name="clear-filter" select="false()"/>
    
    <xsl:variable name="__host__"        select="/a:DATAPACK/a:DOCUMENT/a:RESULTSET[@a:QUERY='ace']/a:RESULTS/a:INFO/a:Host"/>
    <xsl:variable name="__domain__"      select="/a:DATAPACK/a:DOCUMENT/a:RESULTSET[@a:QUERY='ace']/a:RESULTS/a:INFO/a:Domain"/>
    <xsl:variable name="__whereis__"     select="/a:DATAPACK/a:DOCUMENT/a:RESULTSET[@a:QUERY='ace']/a:RESULTS/a:INFO/a:__whereis"/>
    <xsl:variable name="__whereisexp__"  select="/a:DATAPACK/a:DOCUMENT/a:RESULTSET[@a:QUERY='ace']/a:RESULTS/a:INFO/a:__whereisexp"/>
    <xsl:variable name="__invid__"       select="/a:DATAPACK/a:DOCUMENT/a:RESULTSET[@a:QUERY='ace']/a:RESULTS/a:INFO/a:__invid"/>
    <xsl:variable name="__entid__"       select="/a:DATAPACK/a:DOCUMENT/a:RESULTSET[@a:QUERY='ace']/a:RESULTS/a:INFO/a:__entid"/>
    <xsl:variable name="__isPost__"      select="js:strCmp(string(/a:DATAPACK/a:HTTPHEADERS/a:REQUEST_METHOD), 'POST')"/>

    <xsl:comment>NOCONTAINER
      ADD-HEADER|Cache-Control: no-cache, no-store, must-revalidate
      ADD-HEADER|Pragma: no-cache
      ADD-HEADER|Expires: -1
      <xsl:if test="$__isPost__ or $always">
        ADD-HEADER|Set-Cookie: whereis=<xsl:value-of select="$__whereis__"/>; EXPIRES=<xsl:value-of select="$__whereisexp__"/>; PATH=/; httponly;
      </xsl:if>
      <xsl:if test="string-length($__invid__) != 0">
        ADD-HEADER|Set-Cookie: invid=<xsl:value-of select="$__invid__"/>; PATH=/; httponly;
      </xsl:if>
      <xsl:if test="string-length($__entid__) != 0">
        ADD-HEADER|Set-Cookie: entid=<xsl:value-of select="$__entid__"/>; PATH=/; httponly;
      </xsl:if>
      <xsl:if test="$clear-filter">
        ADD-HEADER|Set-Cookie: filter=; PATH=/; EXPIRES=18 Dec 2013 12:00:00 UTC;
      </xsl:if>
    </xsl:comment>
  </xsl:template>


  <xsl:template match="a:css">
    <xsl:param name="__version__"/>
    
    <link rel="stylesheet" type="text/css" href="{@uri}?_={$__version__}" />
  </xsl:template>
  
  
  <!-- /////////////////////////////////////////////////////////////////// -->
  <msxsl:script language="JScript" implements-prefix="js">
    <![CDATA[ 
    function strEscape(strText) {
      return escape(strText);
    }
    
    function spEscape(strTxt) {
      var strTxt = strTxt.replace(/</g, '%3c');
      strTxt = strTxt.replace(/>/g, '%3e');
      strTxt = strTxt.replace(/ /g, '+');
      return strTxt;
    }
    
    function lowerCase(strText) {
      return (strText || "").toLowerCase();
    }

    function cleanLower(str) {
      return trim(str || "").toLowerCase();
    }

    function trim(str) {
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    
    function strUnescape(strText) {
      return unescape(strText);
    }
    
    function strCmp(lhs, rhs) {
      return (lhs.toLowerCase() == rhs.toLowerCase());
    }
    
    function isEntityOnly(strID, strEID) {
      strID = strID || "";
      strEID = strEID || "";
      
      return (strID.length == 0 && strEID.length > 0);
    }
    
    function replace(strIN, findStr, replaceWithStr) {
      findStr = findStr || "";
      replaceWithStr = replaceWithStr || "";
      strIN = strIN || "";
      
      if(findStr.length == 0 || strIN.length == 0) return strIN;
      
      return strIN.replace(findStr, replaceWithStr);
    }
    
    function jsEscape(str) {
      return str.replace(/"/g, '\\"');
    }
   ]]>
  </msxsl:script>
</xsl:stylesheet>