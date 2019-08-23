<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2006/xpath-functions">

	<xsl:output method="html" indent="yes" />
	<xsl:attribute-set name="counter">
		<xsl:attribute name="class">numeric</xsl:attribute>
		<xsl:attribute name="style">text-align:right;padding-right:.6em;font-size:.63em;</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="freq">
		<xsl:attribute name="class">numeric</xsl:attribute>
		<xsl:attribute name="style">text-align:right;padding-right:.6em;</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="nfreq">
		<xsl:attribute name="style">text-align:right;padding-right:.6em;font-size:2em;</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="ji">
		<xsl:attribute name="class">ji</xsl:attribute>
		<xsl:attribute name="style">width:14em;font-family:&quot;sun-exta&quot;;font-size:1.6em</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="scope">
		<xsl:attribute name="class">ji</xsl:attribute>
	</xsl:attribute-set>

	<xsl:template match="/kanji">
	<xsl:element name="html">
		<xsl:element name="head">
			<title>jeumCron</title>
			<link rel="stylesheet" type="text/css" href="/css/std.css" />
			<link rel="stylesheet" href="/css/chinese.css" type="text/css"/>
		</xsl:element>
		<xsl:element name="body">
			<xsl:element name="table">
				<tr>
					<th/>
					<th style="width:1.7em;text-align:right;">preced- ence</th>
					<th>kanji</th>
					<th>description</th>
				</tr>
				<xsl:for-each select="entry">
				<xsl:element name="tr">
					<xsl:variable name="isAlph" select="string(number(@freq))='NaN'" /> 
					<xsl:if test="$isAlph">
						<xsl:attribute name="data-alpha">1</xsl:attribute>
					</xsl:if>
					<xsl:element name="td" use-attribute-sets="counter">
						<xsl:value-of select="position()" />
					</xsl:element>
					<xsl:choose>
						<xsl:when test="$isAlph">
							<xsl:element name="td" use-attribute-sets="nfreq">
								<xsl:value-of select="@freq"/>
							</xsl:element>
						</xsl:when>
						<xsl:otherwise>
							<xsl:element name="td" use-attribute-sets="freq">
								<xsl:value-of select="@freq"/>
							</xsl:element>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:element name="td" use-attribute-sets="ji">
						<xsl:value-of select="@ji" disable-output-escaping="yes"/>
					</xsl:element>
					<xsl:element name="td" use-attribute-sets="scope">
						<xsl:value-of select="."/>
					</xsl:element>
				</xsl:element>
				</xsl:for-each>
			</xsl:element>
			resource:<a href="http://www.loria.fr/~roegel/chinese/list-simp-char.pdf">loria.fr</a>
		</xsl:element>
	</xsl:element>
	</xsl:template>
</xsl:stylesheet>