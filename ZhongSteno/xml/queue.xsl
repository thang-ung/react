<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
                xmlns       ="http://www.alacra.com/"
                xmlns:a     ="http://www.alacra.com/"
                xmlns:xsl   ="http://www.w3.org/1999/XSL/Transform"
                xmlns:msxsl ="urn:schemas-microsoft-com:xslt"
                xmlns:js    ="http://www.alacra.com/ace/js"
                exclude-result-prefixes="msxsl a xsl">

  <xsl:include href="tools.xsl"/>

  <xsl:variable name="results"        select="/a:DATAPACK/a:DOCUMENT/a:RESULTSET[@a:QUERY='ace']/a:RESULTS"/>
  <xsl:variable name="buttons"        select="$results/a:buttons"/>
  <xsl:variable name="data"           select="$results/a:data"/>
  <xsl:variable name="if-screens"     select="$results/a:screens"/>
  <xsl:variable name="basicconfig"    select="$results/a:basicconfig"/>

  <xsl:variable name="screen-config"  select="$results/a:screenConfig"/>
  <xsl:variable name="config"         select="$screen-config/a:config"/>
  <xsl:variable name="fields"         select="$screen-config/a:fields"/>
  <xsl:variable name="strings"        select="$screen-config/a:strings"/>
  <xsl:variable name="filterItems"    select="$screen-config/a:filterItems"/>
  <xsl:variable name="capability"     select="$screen-config/a:capabilities"/>
  <xsl:variable name="result-config"  select="$config/a:result"/>
  <xsl:variable name="queue"          select="$results/a:RESULT/a:queue"/>
  <xsl:variable name="recent_inv"     select="$results/a:RESULT/a:recent_investigations"/>
  <xsl:variable name="related_inv"    select="$results/a:RESULT/a:related_inv"/>
  <xsl:variable name="total-count"    select="$results/a:total_count"/>
  <xsl:variable name="batch-size"     select="$config/@batch_size"/>

  <xsl:variable name="hasBatchProcessing" select="$basicconfig/@hasBatchProcessing='true'"/>
  <xsl:variable name="hasMultipleEntities" select="$basicconfig/@investigationHasMultipleEntities='true'"/>

  <xsl:variable name="root"           select="/a:DATAPACK/a:DOCUMENT[a:RESULTSET/@a:QUERY='ace']"/>
  <xsl:variable name="constraints"    select="$root/a:QUERY[@a:NAME='ace']/a:CONSTRAINTS"/>
  <xsl:variable name="isDebug"        select="number($constraints/a:debug/a:VALUE)=1"/>


  <xsl:variable name="sk"             select="js:strEscape(string($root/a:QUERY[@a:NAME='ace']/a:XLSELEMENTS/a:sk/a:VALUE))"/>
  <xsl:variable name="f"              select="string($root/a:QUERY[@a:NAME='ace']/a:CONSTRAINTS/a:f/a:VALUE)"/>

  <!-- Sort Field Control -->

  <xsl:variable name="position">
    <xsl:choose>
      <xsl:when test="string($filterItems/@pos)">
        <xsl:value-of select="string($filterItems/@pos)"/>
      </xsl:when>
      <xsl:otherwise>0</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>
  <!-- XXXXXXXXXXX -->

  <xsl:template name="title">
    <xsl:param name="screen-title"/>

    <xsl:param name="title">
      <xsl:choose>
        <xsl:when test="string($screen-title)">
          <xsl:value-of select="$screen-title"/>
        </xsl:when>
        <xsl:otherwise>
          Queue
        </xsl:otherwise>
      </xsl:choose>
    </xsl:param>
    
    
    ACE | <xsl:value-of select="normalize-space($title)"/> <xsl:if test="number($results/a:__page)">
      (p. <xsl:value-of select="number($results/a:__page)+1"/>)
    </xsl:if>
  </xsl:template>

  <xsl:template name="head-script-style">
    <xsl:param name="__version__"/>

    <link rel="stylesheet" type="text/css" href="/ace/css/queue.css?_={$__version__}" />

    <xsl:apply-templates select="$config/a:css">
      <xsl:with-param name="__version__" select="$__version__"/>
    </xsl:apply-templates>

    <xsl:choose>
      <xsl:when test="$isDebug = true()">
        <!-- NOTE: this is for DEBUG!!! -->
        <script data-main="/ace/js/queue" src="/ace/js/require.js?_={$__version__}"></script>
      </xsl:when>
      <xsl:otherwise>
        <!-- NOTE: this is for production-->
        <script data-main="/ace/js/queue-built" src="/ace/js/require.js?_={$__version__}"></script>
      </xsl:otherwise>
    </xsl:choose>


    <script type="text/javascript">
      window.getCustomProcessFilterParameters = function window$getCustomProcessFilterParameters(filter_params) {
      if (filter_params == null || filter_params.filters == null) return;

      var searching_addr_d = false;
      var searching_entity_d = false;
      <!-- this is actually, imho, a small improvement over the previous, c# implementation -->
      <!-- because in c#, only when fields from entity table are filtered will deleted flag be respected -->
      for (var fp in filter_params.filters) {
      if (filter_params.hasOwnProperty(fp)) {
      var ctrlname = filter_params[fp].ctrl_name;
      if (ctrlname.lastIndexOf("ent_address_", 0) === 0) {
      searching_addr_d = true;
      } else if (ctrlname.lastIndexOf("ent_", 0) === 0) {
      searching_entity_d = true;
      }
      }
      }

      base_filter_params = [
      {"ctrl_name":"inv_is_deleted",
      "ctrl_val":"true",
      "op":13
      }
      ];

      // if searching address
      if (searching_addr_d) {
      base_filter_params.push({"ctrl_name":"addr_is_deleted",
      "ctrl_val":"true",
      "op":13
      });
      }
      // if searching entities
      if (searching_entity_d) {
      base_filter_params.push.apply([{"ctrl_name":"ent_valid",
      "ctrl_val":"true",
      "op":8
      },
      {"ctrl_name":"ent_is_deleted",
      "ctrl_val":"true",
      "op":13
      }]);
      }

      filter_params.filters.push.apply(base_filter_params);
      return filter_params;
      }
    </script>
  </xsl:template>

  <xsl:template match="/">
    <xsl:call-template name="body"/>
  </xsl:template>

  <xsl:template name="body">
    <!-- TODO: put it back when ready -->
    <xsl:apply-templates select="$config/a:filter"/>
    <xsl:apply-templates select="$config/a:actions"/>
    <xsl:apply-templates select="$config/a:result"/>
  </xsl:template>

  <xsl:template match="a:filter">
    <xsl:param name="this-element-name" select="local-name(.)"/>
    <xsl:param name="str-id" select="@str_id"/>

    <xsl:variable name="has-export" select="$capability/a:capability[@id=25]"/>

    <div class="form queue filter">
      <div class="clearFloat">
        <span class="heading">
          <xsl:value-of select="$strings/a:string[js:strCmp(string(@str_id),string($str-id))]"/>
        </span>
        <span class="sofit">&#160;</span>
        <xsl:if test="$has-export">
          <span class="export">Export to Excel</span>
        </xsl:if>
      </div>

      <table colspan="0" cellspan="0" id="{$this-element-name}">
        <tr>
          <td>
            <xsl:apply-templates select="*"/>
            <div id="subfilter">

            </div>
          </td>
          <td>
            <span type="button" id="btnLoadFilter">
              <xsl:attribute name="class">submit-btn <xsl:if test="not($filterItems/a:item)">disable</xsl:if></xsl:attribute>
              <xsl:variable name="btn-str-id" select="a:button[@id='btnLoadFilter']/@str_id"/>
              <xsl:variable name="btn-text" select="$strings/a:string[js:strCmp(string(@str_id), string($btn-str-id))]"/>
              <xsl:choose>
                <xsl:when test="string($btn-text)">
                  <xsl:value-of select="normalize-space($btn-text)"/>
                </xsl:when>
                <xsl:otherwise>Load Filter</xsl:otherwise>
              </xsl:choose>
            </span>
            <span type="button" id="btnClear">
              <xsl:attribute name="class">submit-btn <xsl:if test="not($filterItems/a:item)">disable</xsl:if></xsl:attribute>
              Reset
            </span>
          </td>
        </tr>
      </table>

    </div>
    <div class="clear">&#160;</div>
    <div class="header bar form">
      <form method="POST" action="/cgi-bin/alacraswitchISAPI.dll" name="filterItems">
        <span id="{concat($this-element-name,'-collection')}" data-isinit="{string($filterItems/@isInit)}">
          <xsl:if test="string($position)">
            <xsl:attribute name="data-pos">
              <xsl:value-of select="$position"/>
            </xsl:attribute>
          </xsl:if>
          <xsl:apply-templates select="$filterItems/a:item" mode="filter"/>

          <!-- Save Filter -->
          <xsl:if test="$filterItems/a:item and not(string($results/a:filter/@name))">
            <span type="button" id="saveFilterButton">
              <xsl:attribute name="class">
                submit-btn <xsl:if test="not($filterItems/a:item)">disable</xsl:if>
              </xsl:attribute>
              Save Filter
            </span>
          </xsl:if>
        </span>

        <input type="hidden" name="app" value="ace"/>
        <input type="hidden" name="msg" value="ExecContent"/>
        <input type="hidden" name="topic" value="Search"/>
        <input type="hidden" name="sk" value="{$sk}"/>
        <xsl:if test="$isDebug = true()">
          <input type="hidden" name="debug" value="1"/>
        </xsl:if>
        <xsl:apply-templates select="$filterItems/a:sort" mode="filter"/>
        
      </form>
    </div>
  </xsl:template>

  <xsl:template match="a:actions">
    <xsl:param name="this-element-name" select="local-name(.)"/>
    <xsl:param name="str-id" select="@str_id"/>

    <div class="form queue actions">
      <div class="clearFloat">
        <span class="heading">
          <xsl:value-of select="$strings/a:string[js:lowerCase(string(@str_id)) = js:lowerCase(string($str-id))]"/>
        </span>
        <span class="sofit">&#160;</span>
      </div>

      <table colspan="0" cellspan="0" id="{$this-element-name}">
        <tr>
          <td>
            <xsl:apply-templates select="*"/>
          </td>
        </tr>
      </table>

      <div id="applyActions"></div>
    </div>
    <div class="clear">&#160;</div>


  </xsl:template>

  <xsl:template match="a:result">
    <xsl:param name="str-id" select="@str_id"/>

    <div class="form queue">
      <div class="clearFloat">
        <span class="heading">
          <xsl:value-of select="$strings/a:string[js:lowerCase(string(@str_id)) = js:lowerCase(string($str-id))]"/>
        </span>
        <span class="sofit">&#160;</span>
      </div>

      <xsl:variable name="data-rows">
        <xsl:choose>
          <xsl:when test="$queue/a:investigation/a:row">
            <xsl:copy-of  select="$queue/a:investigation/a:row"/>
          </xsl:when>
          <xsl:when test="$related_inv/a:investigation/a:row">
            <xsl:copy-of select="$related_inv/a:investigation/a:row"/>
          </xsl:when>
        </xsl:choose>
      </xsl:variable>

      <xsl:variable name="isRelated" select="$f='related_inv'"/>

      <xsl:if test="$recent_inv/a:investigation/a:row">
        <div id="recent">
          <div class="title" title="Click to hide/show">
            <strong>Recently Viewed Cases</strong>
          </div>
          <table colspan="0" cellspan="0" id="recentqueue">
            <thead>
              <tr>
                <xsl:apply-templates select="$result-config/a:item" mode="header">
                  <xsl:with-param name="mode">recent</xsl:with-param>
                </xsl:apply-templates>
              </tr>
            </thead>
            <tbody>
              <xsl:apply-templates select="$recent_inv/a:investigation/a:row" mode="recent"/>
            </tbody>
          </table>
        </div>
      </xsl:if>


      <div id="queue-wrapper">
        <div class="title" title="Click to hide/show">
          <strong>All Cases</strong>
        </div>
        <xsl:choose>
          <xsl:when test="$data-rows and msxsl:node-set($data-rows)/*">
            <table colspan="0" cellspan="0" id="queue">
              <thead>
                <tr>
                  <xsl:apply-templates select="$result-config/a:item" mode="header"/>
                </tr>
              </thead>
              <tbody>
                <!--<xsl:apply-templates select="$recent_inv/a:investigation/a:row" mode="recent"/>-->
                <xsl:apply-templates select="msxsl:node-set($data-rows)/*"/>
              </tbody>
              <tfoot>
                <xsl:call-template name="pagination">
                  <xsl:with-param name="col-count" select="count($result-config/a:item)"/>
                  <xsl:with-param name="queue" select="$queue"/>
                </xsl:call-template>
              </tfoot>
            </table>
          </xsl:when>
          <xsl:otherwise>
            <div class="error1">
              <xsl:choose>
                <xsl:when test="$isRelated">No related cases.</xsl:when>
                <xsl:otherwise>No cases match the search criteria you selected.</xsl:otherwise>
              </xsl:choose>
            </div>
          </xsl:otherwise>
        </xsl:choose>
      </div>
    </div>
    <div class="clear">&#160;</div>

  </xsl:template>

  <xsl:template name="pagination">
    <xsl:param name="col-count"/>
    <xsl:param name="queue"/>

    <xsl:variable name="has-next" select="$queue/@next='true'"/>
    <xsl:variable name="has-prev" select="$queue/@prev='true'"/>
    <xsl:variable name="has-export" select="$capability/a:capability[@id=25]"/>

    <!-- Only render it when there are navigations available -->
    <!--<xsl:if test="$has-next or $has-prev">-->
      <xsl:variable name="current-page" select="$queue/@nextpos"/>
      <tr>
        <td colspan="{number($col-count)}">
          <!--<xsl:if test="$has-next or $has-prev">-->
            <span class="navigation prev" data-pos="{$queue/@prevpos}">
              <xsl:if test="not($has-prev)">
                <xsl:attribute name="data-enabled">false</xsl:attribute>
              </xsl:if>
              &#171;&#160;Prev
            </span>
            <span class="navigation-container">
              <xsl:call-template name="page">
                <xsl:with-param name="current-page" select="number($current-page)"/>
              </xsl:call-template>
            </span>
            <span class="navigation next" data-pos="{$queue/@nextpos}">
              <xsl:if test="not($has-next)">
                <xsl:attribute name="data-enabled">false</xsl:attribute>
              </xsl:if>
              Next&#160;&#187;
            </span>
            <span class="nav-info">
              <span class="pipe">|</span>
              <span class="nav-info-text">
                <xsl:variable name="page-to">
                  <xsl:choose>
                    <xsl:when test="number($current-page*$batch-size) &lt; $total-count">
                      <xsl:value-of select="number($current-page*$batch-size)"/>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="$total-count"/>
                    </xsl:otherwise>
                  </xsl:choose>
                </xsl:variable>
                <xsl:value-of select="concat(format-number(number((($current-page)-1)*$batch-size+1), '#,##0'), ' - ', format-number(number($page-to), '#,##0'), ' of ', format-number($total-count,'#,##0'))"/>
              </span>
            </span>
          <!--</xsl:if>-->
          <span class="batch-size">
            Results per page:
            <select name="batch_size">
              <xsl:apply-templates select="$fields/a:field[@id=2535]/a:item" mode="ddl">
                <xsl:sort select="a:sort_order" data-type="number"/>
                <xsl:sort select="a:name" data-type="text"/>
                <xsl:with-param name="value" select="$batch-size"/>
              </xsl:apply-templates>
            </select>
          </span>
        </td>
      </tr>
    <!--</xsl:if>-->
  </xsl:template>

  <xsl:template name="page">
    <xsl:param name="total-count" select="$total-count"/>
    <xsl:param name="batch-size" select="$batch-size"/>
    <xsl:param name="page" select="number(1)"/>
    <xsl:param name="current-page" select="number(1)"/>

    <xsl:variable name="number-of-pages" select="number(ceiling($total-count div $batch-size))"/>
    <xsl:variable name="block-size" select="number(5)"/>
    <xsl:variable name="block-offset" select="number(floor($block-size div 2))"/>

    <xsl:variable name="min-page">
      <xsl:choose>
        <xsl:when test="$current-page &lt; $block-size">1</xsl:when>
        <xsl:when test="$current-page &gt; ($number-of-pages - $block-size)">
          <xsl:value-of select="$number-of-pages - $block-size"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$current-page - $block-offset"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="max-page">
      <xsl:choose>
        <xsl:when test="$current-page &lt; $block-size">
          <xsl:value-of select="$block-size"/>
        </xsl:when>
        <xsl:when test="$current-page &gt; ($number-of-pages - $block-size)">
          <xsl:value-of select="$number-of-pages"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$current-page + $block-offset"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>



    <xsl:if test="$page &lt;= $number-of-pages and $number-of-pages &gt; 1">
      <xsl:if test="number($min-page) &gt; 1 and $page=1">
        <span class="navigation page" data-pos="{($page)-1}">
          <xsl:value-of select="$page"/>
        </span>
        <span class="ellipsis">...</span>
      </xsl:if>

      <xsl:if test="number($min-page) &lt;= $page and number($max-page) &gt;= $page">
        <span data-pos="{($page)-1}">
          <xsl:attribute name="class">
            navigation page <xsl:if test="$current-page = $page">current</xsl:if>
          </xsl:attribute>

          <xsl:value-of select="$page"/>
        </span>
      </xsl:if>

      <xsl:if test="$page &lt;= ($current-page + $block-size)">
        <xsl:call-template name="page">
          <xsl:with-param name="total-count" select="$total-count"/>
          <xsl:with-param name="batch-size" select="$batch-size"/>
          <xsl:with-param name="page" select="$page+1"/>
          <xsl:with-param name="current-page" select="$current-page"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:if>


  </xsl:template>

  <xsl:template match="a:row" mode="attr_display">
    <xsl:param name="field"/>
    <xsl:param name="config_item"/>

    <xsl:variable name="ctrl" select="$field/@ctrl"/>
    <xsl:variable name="value_original" select="./@*[local-name()=concat(string($ctrl),'__original')]"/>
    <xsl:variable name="field_item" select="$field/a:item[@value = $value_original]"/>
    <xsl:variable name="value_display" select="$field_item/*[local-name() = $config_item/@value]"/>
    <xsl:variable name="value" select="./@*[local-name() = $ctrl]"/>

    <xsl:choose>
      <xsl:when test="string($value_display)">
        <li title="{$value}">
          <xsl:value-of select="$value_display"/>
        </li>
      </xsl:when>
      <xsl:otherwise>
        <li>
          <xsl:value-of select="$value"/>
        </li>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="a:row" mode="attr_display_img">
    <xsl:param name="field"/>
    <xsl:param name="config_item"/>

    <xsl:variable name="ctrl" select="$field/@ctrl"/>
    <xsl:variable name="value_original" select="./@*[local-name()=concat(string($ctrl),'__original')]"/>
    <xsl:variable name="value" select="./@*[local-name() = $ctrl]"/>

    <xsl:if test="string($value_original)">
      <li title="{$value}">
        <span type="img" class="{$config_item/@type}{$value_original}" title="{$value}" name="{$ctrl}" data-value="{$value_original}"></span>      
      </li>
    </xsl:if>
  </xsl:template>

  <xsl:template match="a:row">
    <xsl:param name="cfg" select="$result-config/*"/>
    <xsl:variable name="this-row" select="."/>

    <tr>
      <xsl:apply-templates select="$cfg">
        <xsl:with-param name="data" select="$this-row"/>
      </xsl:apply-templates>
    </tr>
  </xsl:template>

  <xsl:template match="a:row" mode="recent">
    <xsl:param name="cfg" select="$result-config/*"/>
    <xsl:variable name="this-row" select="."/>

    <tr class="recent alt{position() mod 2}" title="Recently visited case">
      <xsl:apply-templates select="$cfg">
        <xsl:with-param name="data" select="$this-row"/>
      </xsl:apply-templates>
    </tr>
  </xsl:template>

  <xsl:template match="a:row" mode="internal">
    <xsl:param name="cfg" select="$result-config/*"/>
    <xsl:variable name="this-row" select="."/>

    <xsl:apply-templates select="$cfg" mode="internal">
      <xsl:with-param name="data" select="$this-row"/>
    </xsl:apply-templates>
  </xsl:template>

  <xsl:template match="a:entity|a:service" mode="internal">
    <xsl:param name="data"/>
    <xsl:variable name="this-cfg" select="."/>

    <xsl:if test="local-name() = 'entity' and count($data/a:entity/a:row) &gt; 0">
      <div class="internal" type="{@type}">
        <div class="title">Entities</div>
        <xsl:for-each select="$data/a:entity/a:row">
          <div>
            <xsl:apply-templates select="." mode="internal">
              <xsl:with-param name="cfg" select="$this-cfg/*"/>
            </xsl:apply-templates>
          </div>
        </xsl:for-each>
      </div>
    </xsl:if>

    <xsl:if test="local-name() = 'service' and count($data/a:service/a:row) &gt; 0">
      <div class="internal" type="{@type}">
        <div class="title">Service(s)</div>
        <xsl:for-each select="$data/a:service/a:row">
          <xsl:sort select="@__order" data-type="number"/>
          <xsl:sort select="@ext_service_service_id" data-type="text"/>
          <div>
            <xsl:apply-templates select="." mode="internal">
              <xsl:with-param name="cfg" select="$this-cfg/*"/>
            </xsl:apply-templates>
          </div>
        </xsl:for-each>
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="a:item" mode="header">
    <xsl:param name="mode"/>
    
    <xsl:variable name="header-str-id" select="@header_str_id"/>
    <xsl:variable name="field-id" select="@field_id"/>

    <xsl:variable name="ctrl">
      <xsl:choose>
        <xsl:when test="string($fields/a:field[@id=$field-id]/@ctrl)">
          <xsl:value-of select="$fields/a:field[@id=$field-id]/@ctrl"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="sub-field-id" select="a:item/@field_id"/>
          <xsl:value-of select="$fields/a:field[@id=$sub-field-id]/@ctrl"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <th>
      <xsl:if test="@style">
        <xsl:attribute name="style">
          <xsl:value-of select="string(@style)"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:variable name="header" select="string($strings/a:string[js:strCmp(string(@str_id), string($header-str-id))])"/>
      <xsl:value-of select="$header"/>
      <xsl:if test="string($header) and string($mode) != 'recent' ">
        <xsl:if test="not(string(@nosort))">
        <span data-ctrl-name="{$ctrl}">
          <xsl:attribute name="class">
            sort  <xsl:if test="$filterItems/a:sort[@sort_ctrl=$ctrl]">
              <xsl:value-of select="$filterItems/a:sort[@sort_ctrl=$ctrl]/@sort_dir"/>
            </xsl:if>
          </xsl:attribute>
          <xsl:attribute name="data-sort-dir">
            <xsl:if test="$filterItems/a:sort[@sort_ctrl=$ctrl]/@sort_dir">
              <xsl:value-of select="$filterItems/a:sort[@sort_ctrl=$ctrl]/@sort_dir"/>
            </xsl:if>
          </xsl:attribute>
        </span>
        </xsl:if>
      </xsl:if>
    </th>
  </xsl:template>

  <xsl:template match="a:block">
    <div>
      <xsl:apply-templates select="*" mode="config"/>
    </div>
  </xsl:template>

  <xsl:template match="a:item">
    <xsl:param name="data"/>

    <xsl:variable name="field-id" select="@field_id"/>
    <xsl:variable name="field" select="$fields/a:field[@id=$field-id]"/>
    <xsl:variable name="ctrl" select="$field/@ctrl"/>
    <xsl:variable name="value" select="$data/@*[local-name()=$ctrl]"/>
    <xsl:variable name="value_original" select="$data/@*[local-name()=concat(string($ctrl),'__original')]"/>
    <xsl:variable name="mode" select="@mode"/>
    <xsl:variable name="title" select="$data/@title"/>
    <xsl:variable name="data-type" select="$field/@type"/>

    <xsl:variable name="range_field_id" select="@range_field_id"/>
    <xsl:variable name="range_ctrl" select="$fields/a:field[@id=$range_field_id]/@ctrl"/>
    <xsl:variable name="range_value_original" select="$data/@*[local-name()=concat(string($range_ctrl),'__original')]"/>
    <xsl:variable name="range_value" select="$data/@*[local-name()=$range_ctrl]"/>

    <td>
      <xsl:if test="@style">
        <xsl:attribute name="style">
          <xsl:value-of select="string(@style)"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="class">
        <xsl:apply-templates select="@type" mode="class"/>
      </xsl:attribute>
      <xsl:apply-templates select="@type">
        <xsl:with-param name="data" select="$data"/>
        <xsl:with-param name="ctrl" select="$ctrl"/>
        <xsl:with-param name="value" select="$value"/>
        <xsl:with-param name="mode" select="$mode"/>
        <xsl:with-param name="title" select="$title"/>
        <xsl:with-param name="data-type" select="$data-type"/>
        <xsl:with-param name="value_original" select="$value_original"/>
        <xsl:with-param name="range_value" select="$range_value"/>
        <xsl:with-param name="range_value_original" select="$range_value_original"/>
        <xsl:with-param name="field" select="$field"/>
      </xsl:apply-templates>
    </td>
  </xsl:template>

  <xsl:template match="@type[.='risk' or .='risk5' or .='priority' or .='status' or .='rr' or .='ed']" mode="class">img</xsl:template>

  <xsl:template match="a:item" mode="internal">
    <xsl:param name="data"/>

    <xsl:variable name="field-id" select="@field_id"/>
    <xsl:variable name="ctrl" select="$fields/a:field[@id=$field-id]/@ctrl"/>
    <xsl:variable name="value" select="$data/@*[local-name()=$ctrl]"/>
    <xsl:variable name="group-id" select="$data/@groupID"/>
    <xsl:variable name="mode" select="@mode"/>
    <xsl:variable name="field" select="$fields/a:field[@id=$field-id]"/>
    <xsl:variable name="data-type" select="$field/@type"/>

    <xsl:variable name="value_original" select="$data/@*[local-name()=concat(string($ctrl),'__original')]"/>
    <xsl:variable name="range_field_id" select="@range_field_id"/>
    <xsl:variable name="range_ctrl" select="$fields/a:field[@id=$range_field_id]/@ctrl"/>
    <xsl:variable name="range_value_original" select="$data/@*[local-name()=concat(string($range_ctrl),'__original')]"/>
    <xsl:variable name="range_value" select="$data/@*[local-name()=$range_ctrl]"/>

    <xsl:apply-templates select="@type">
      <xsl:with-param name="data" select="$data"/>
      <xsl:with-param name="ctrl" select="$ctrl"/>
      <xsl:with-param name="value" select="$value"/>
      <xsl:with-param name="group-id" select="$group-id"/>
      <xsl:with-param name="mode" select="$mode"/>
      <xsl:with-param name="data-type" select="$data-type"/>
      <xsl:with-param name="value_original" select="$value_original"/>
      <xsl:with-param name="range_value" select="$range_value"/>
      <xsl:with-param name="range_value_original" select="$range_value_original"/>
    </xsl:apply-templates>

  </xsl:template>

  <xsl:template match="a:item" mode="config">

    <xsl:variable name="field-id" select="@field_id"/>
    <xsl:variable name="field" select="$fields/a:field[@id=$field-id]"/>
    <xsl:variable name="table-name" select="$field/@table"/>
    <xsl:variable name="column-name" select="$field/@column"/>
    <xsl:variable name="str-id" select="@str_id"/>
    <xsl:variable name="data-type" select="$field/@type"/>

    <xsl:variable name="value" select="string($strings/a:string[js:strCmp(string(@str_id),string($str-id))])"/>

    <xsl:apply-templates select="@type">
      <xsl:with-param name="ctrl" select="$field/@ctrl"/>
      <xsl:with-param name="field-id" select="$field-id"/>
      <xsl:with-param name="value" select="$value"/>
      <xsl:with-param name="data-type" select="$data-type"/>
    </xsl:apply-templates>

  </xsl:template>

  <xsl:template match="@type[.='edit']">
    <xsl:param name="data"/>
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>

    <a href="/cgi-bin/alacraswitchISAPI.dll?app=ace&amp;msg=ExecContent&amp;topic=InputForm&amp;sk={$sk}&amp;id={$value}" 
       class="edit-case"
       title="Edit">
      <xsl:text/>
    </a>
  </xsl:template>
  
  <xsl:template match="@type[.='checkbox']">
    <xsl:param name="data"/>
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>

    <input type="checkbox" name="{$ctrl}" value="{$value}"/>
  </xsl:template>

  <xsl:template match="@type[.='hidden']">
    <xsl:param name="data"/>
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>

    <input type="hidden" name="{$ctrl}" value="{$value}"/>
  </xsl:template>

  <xsl:template match="@type[.='risk' or .='risk5' or .='priority' or .='rr' or .='ed']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="data-type"/>
    <xsl:param name="value_original"/>
    <xsl:param name="field"/>

    <xsl:variable name="config_item" select="./.."/>
      
    <xsl:choose>
      <xsl:when test="string($value_original)">
        <span type="img" class="{string(.)}{$value_original}" title="{$value}" name="{$ctrl}" data-value="{$value_original}"></span>      
      </xsl:when>
      <xsl:when test="$data//a:row/@*[local-name(.)=$ctrl]">
        <!-- If the value is empty, see if there is a sub-list that has a match -->
        <ul>
          <xsl:apply-templates select="$data//a:row[@*[local-name(.)=$ctrl]]" mode="attr_display_img">
            <xsl:with-param name="field" select="$field"/>
            <xsl:with-param name="config_item" select="$config_item"/>
          </xsl:apply-templates>
        </ul>
      </xsl:when>
      <xsl:otherwise>
        <xsl:text></xsl:text>
      </xsl:otherwise>
    </xsl:choose>
    
  </xsl:template>

  <xsl:template match="@type[.='status']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="data-type"/>
    <xsl:param name="value_original"/>

    <xsl:variable name="icon" select="$fields/a:field[@id=1070]/a:item[@value=$value_original]/a:icon"/>
    <span type="img" class="icon{$icon}" title="{$value}" name="{$ctrl}" data-value="{$value_original}"></span>

  </xsl:template>

  <xsl:template match="@type[.='hasdocs']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="data-type"/>
    <xsl:param name="value_original"/>

    <span type="img" class="{string(.)}{$value}" title="Potential Findings Included" name="{$ctrl}" data-value="{$value_original}"></span>
  </xsl:template>

  <xsl:template match="@type[.='sla']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="data-type"/>
    <xsl:param name="range_value" />
    <xsl:param name="range_value_original" />

    <span class="{string(.)}{$range_value_original}" title="{$range_value}" name="{$ctrl}" data-value="{$value}">
      <xsl:value-of select="$value"/>
    </span>
  </xsl:template>

  <xsl:template match="@type[.='case-type' or .='case-monitoring']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="data-type"/>
    <xsl:param name="value_original"/>

    <span type="img" class="{concat(.,$value_original)}" title="{$value}" name="{$ctrl}" data-value="{$value_original}"></span>

  </xsl:template>

  <xsl:template match="@*" mode="attr">
    <li>
      <xsl:value-of select="."/>
    </li>
  </xsl:template>

  <xsl:template match="@type[.='label']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="data-type"/>

    <xsl:choose>
      <xsl:when test="string($ctrl)">

        <span name="{$ctrl}" data-type="{$data-type}">
          <xsl:if test="starts-with(string($value),'[unnamed')">
            <xsl:attribute name="class">unnamed</xsl:attribute>
          </xsl:if>
          <xsl:choose>
            <xsl:when test="string($value)">
              <xsl:value-of select="$value"/>
            </xsl:when>
            <xsl:when test="$data//a:row/@*[local-name(.)=$ctrl]">
              <!-- If the value is empty, see if there is a sub-list that has a match -->
              <ul>
                <xsl:apply-templates select="$data//a:row/@*[local-name(.)=$ctrl]" mode="attr"/>
              </ul>
            </xsl:when>
            <xsl:otherwise>
              <!-- this prevents self-closing -->
              <xsl:text></xsl:text>
            </xsl:otherwise>
          </xsl:choose>
        </span>
      </xsl:when>
      <xsl:otherwise>
        <label data-type="{$data-type}">
          <xsl:value-of select="$value"/>
        </label>
      </xsl:otherwise>
    </xsl:choose>

    <xsl:apply-templates select="../*" mode="internal">
      <xsl:with-param name="data" select="$data"/>
    </xsl:apply-templates>
  </xsl:template>

  <xsl:template match="@type[.='label_value']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="data-type"/>
    <xsl:param name="value_original"/>
    <xsl:param name="field"/>

    <xsl:variable name="config_item" select="./.."/>    
    <xsl:variable name="field_item" select="$field/a:item[@value = $value_original]"/>
    <xsl:variable name="value_display" select="$field_item/*[local-name() = $config_item/@value]"/>

    <xsl:choose>
      <xsl:when test="string($ctrl)">

        <span name="{$ctrl}" data-type="{$data-type}">
          <xsl:if test="starts-with(string($value),'[unnamed')">
            <xsl:attribute name="class">unnamed</xsl:attribute>
          </xsl:if>
          <xsl:choose>
            <xsl:when test="string($value_display)">
              <xsl:value-of select="$value_display"/>
            </xsl:when>
            <xsl:when test="string($value)">
              <xsl:value-of select="$value"/>
            </xsl:when>
            <xsl:when test="$data//a:row/@*[local-name(.)=$ctrl]">
              <!-- If the value is empty, see if there is a sub-list that has a match -->
              <ul>
                <xsl:apply-templates select="$data//a:row[@*[local-name(.)=$ctrl]]" mode="attr_display">
                  <xsl:with-param name="field" select="$field"/>
                  <xsl:with-param name="config_item" select="$config_item"/>
                </xsl:apply-templates>
              </ul>
            </xsl:when>
            <xsl:otherwise>
              <!-- this prevents self-closing -->
              <xsl:text></xsl:text>
            </xsl:otherwise>
          </xsl:choose>
        </span>
      </xsl:when>
      <xsl:otherwise>
        <label data-type="{$data-type}">
          <xsl:value-of select="$value"/>
        </label>
      </xsl:otherwise>
    </xsl:choose>

    <xsl:apply-templates select="../*" mode="internal">
      <xsl:with-param name="data" select="$data"/>
    </xsl:apply-templates>
  </xsl:template>

  <xsl:template match="@type[.='link']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="data-type"/>

    <!-- inv_status__original -->

    <xsl:variable name="inv-status" select="number($data/@inv_status__original)"/>
    <xsl:variable name="inv-id" select="string($data/@inv_id)"/>

    <xsl:variable name="topic">
      <xsl:choose>
        <xsl:when test="$inv-status=1">inputform</xsl:when>
        <xsl:otherwise>dashboard</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:choose>
      <xsl:when test="string($ctrl)">
        <a name="{$ctrl}" data-type="{$data-type}" class="link" href="/cgi-bin/alacraswitchISAPI.dll?app=ace&amp;msg=ExecContent&amp;topic={normalize-space($topic)}&amp;sk={$sk}&amp;id={$inv-id}">
          <xsl:if test="starts-with(string($value),'[unnamed')">
            <xsl:attribute name="class">unnamed</xsl:attribute>
          </xsl:if>
          <xsl:choose>
            <xsl:when test="string($value)">
              <xsl:value-of select="$value"/>
            </xsl:when>
            <xsl:when test="$data//a:row/@*[local-name(.)=$ctrl]">
              <!-- If the value is empty, see if there is a sub-list that has a match -->
              <ul>
                <xsl:apply-templates select="$data//a:row/@*[local-name(.)=$ctrl]" mode="attr"/>
              </ul>
            </xsl:when>
            <xsl:otherwise>
              <xsl:text>---</xsl:text>
            </xsl:otherwise>
          </xsl:choose>

          <xsl:apply-templates select="../*" mode="internal">
            <xsl:with-param name="data" select="$data"/>
          </xsl:apply-templates>
        </a>
      </xsl:when>
      <xsl:otherwise>
        <label data-type="{$data-type}" class="link">
          <xsl:value-of select="$value"/>

          <xsl:apply-templates select="../*" mode="internal">
            <xsl:with-param name="data" select="$data"/>
          </xsl:apply-templates>
        </label>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="@type[.='email']">
    <xsl:param name="name"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="title"/>
    <xsl:param name="mode"/>

    <xsl:param name="group-id"/>

    <xsl:if test="string($value)">
      <a href="mailto:{$value}" title="Send email to {$value}" class="email"></a>
    </xsl:if>
  </xsl:template>

  <xsl:template match="@type[.='img']">
    <xsl:param name="name"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>
    <xsl:param name="title"/>
    <xsl:param name="mode"/>

    <xsl:param name="group-id"/>

    <span name="{$name}" value="{$value}" title="{$title}">
      <xsl:attribute name="class">
        <xsl:choose>
          <!-- mode should be checked first -->
          <xsl:when test="string($mode)">
            <xsl:value-of select="$mode"/>
            <xsl:value-of select="$value"/>
          </xsl:when>
          <xsl:when test="string($group-id)">
            <xsl:choose>
              <xsl:when test="string($mode)">
                <xsl:value-of select="$mode"/>
              </xsl:when>
              <xsl:otherwise>group</xsl:otherwise>
            </xsl:choose>
            <xsl:value-of select="$group-id"/>
          </xsl:when>
        </xsl:choose>
      </xsl:attribute>
      <xsl:apply-templates select="../*" mode="internal">
        <xsl:with-param name="data" select="$data"/>
      </xsl:apply-templates>
    </span>
  </xsl:template>

  <xsl:template match="@type[.='button']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>

    <input type="button" name="{$ctrl}" value="{$value}"/>
  </xsl:template>

  <xsl:template match="@type[.='audit']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>

    <a class="audit" href="/cgi-bin/alacraswitchISAPI.dll?app=ace&amp;msg=ExecContent&amp;topic=AuditTrail&amp;sk={$sk}&amp;json=%7B%22filters%22%3A%5B%7B%22ctrl_name%22%3A%22audit_entry_investigationid%22%2C%22ctrl_val%22%3A%22{$value}%22%2C%22op%22%3A8%7D%5D%2C%22pos%22%3A0%2C%22isInit%22%3A%22false%22%7D" title="View Audit Trail">
      <xsl:text/>
    </a>
  </xsl:template>

  <xsl:template match="@type[.='risk-flag']">
    <xsl:param name="data"/>
    <xsl:param name="ctrl"/>
    
    <xsl:variable name="field-item" select="$fields/a:field[@ctrl=$ctrl]/a:item"/>

    <xsl:for-each select="$data/*[local-name()=$ctrl]/a:row">
      <xsl:variable name="value" select="number(@codeId)"/>

      <xsl:variable name="flag" select="$field-item[@value=$value]"/>
      <span class="{$ctrl}" codeid="{$value}" title="{$flag/a:name}">
        <xsl:text></xsl:text>
      </span>
    </xsl:for-each>
    
  </xsl:template>

  <xsl:template match="@type[.='monitor']">
    <xsl:param name="data"/>
    <xsl:param name="ctrl"/>

    <xsl:variable name="is-monitor" select="number($data/@inv_monitor__original)"/>

    <xsl:variable name="class-name">
      <xsl:choose>
        <xsl:when test="$is-monitor=1">active</xsl:when>
        <xsl:otherwise>inactive</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>


    <xsl:variable name="data-value" select="$is-monitor"/>
    <xsl:variable name="final-data-value">
      <xsl:choose>
        <xsl:when test="string($data-value)!='NaN'">
          <xsl:value-of select="$data-value"/>
        </xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    
    <xsl:variable name="title" select="string($data/@inv_monitor)" />
    
    <span class="{$ctrl} {normalize-space($class-name)}" data-value="{normalize-space($final-data-value)}">
      <xsl:attribute name="title">
        <xsl:choose>
          <xsl:when test="$is-monitor=1">
            <xsl:value-of select="$title"/>
            <xsl:text> Active</xsl:text>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$title"/>
            <xsl:text> Inactive</xsl:text>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:attribute>
      <xsl:text></xsl:text>
    </span>
    
  </xsl:template>
  
  <xsl:template match="@type[.='bell']">
    <xsl:param name="data"/>
    <xsl:param name="ctrl"/>

    <xsl:variable name="field-item" select="$fields/a:field[@ctrl=$ctrl]/a:item"/>
    
    <xsl:variable name="title" select="string($data/@inv_bell)"/>
    <xsl:variable name="bell-value" select="number($data/@inv_bell__original)"/>
    
    <span class="{$ctrl} bell" data-id="{$bell-value}" title="{$title}">
      <xsl:text></xsl:text>
    </span>
    
  </xsl:template>
  

  <xsl:template match="@type[.='relationdepth']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>

    <xsl:value-of select="$value"/>
    <span class="suffix">
      <xsl:choose>
        <xsl:when test="$value&lt;1"></xsl:when>
        <xsl:when test="$value=1">st</xsl:when>
        <xsl:when test="$value=2">nd</xsl:when>
        <xsl:when test="$value=3">rd</xsl:when>
        <xsl:when test="$value&gt;3">th</xsl:when>
      </xsl:choose>
      <xsl:text/>
    </span>
  </xsl:template>

  <xsl:template match="@type[.='bookstatus']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="data"/>

    <xsl:variable name="hasBookLink" select="number($data/@book_is_ready)=1"/>
    <xsl:variable name="investigation-name">
      <xsl:if test="not(string($data/@inv_inv_name))">[No Name]</xsl:if>
      <xsl:value-of select="$data/@inv_inv_name"/>
    </xsl:variable>

    <xsl:if test="$hasBookLink">
      <a href="/ace/{$sk}/{$data/@book_pblockerfileid}/report/{js:strEscape(normalize-space($investigation-name))}.pdf" target="_book" class="pdf" title="Download Completed Report">
        <xsl:text/>
      </a>
    </xsl:if>
  </xsl:template>

  <xsl:template match="@type[.='ddl' or .='ddlabel']">
    <xsl:param name="ctrl"/>
    <xsl:param name="value"/>
    <xsl:param name="field-id"/>

    <xsl:variable name="empty-select" select="$fields/a:field[@id=$field-id]/@emptySelect='true'"/>
    <!--<xsl:variable name="defaul-value" select="string($fields/a:field[@id=$field-id]/@defaultValue)"/>-->
    <xsl:variable name="disabled" select="string(../@disabled)='true'"/>

    <xsl:variable name="selected-value">
      <xsl:choose>
        <xsl:when test="string($value)">
          <xsl:value-of select="$value"/>
        </xsl:when>
        <!--<xsl:otherwise>
          <xsl:value-of select="$defaul-value"/>
        </xsl:otherwise>-->
      </xsl:choose>
    </xsl:variable>

    <span>
      <select name="{$ctrl}">
        <xsl:if test="$disabled">
          <xsl:attribute name="disabled">disabled</xsl:attribute>
        </xsl:if>
        <xsl:if test="$empty-select = true()">
          <option>
            <xsl:if test="not(string($value))">
              <xsl:attribute name="selected">selected</xsl:attribute>
            </xsl:if>
            <xsl:if test="$ctrl='filter_field'">
              <xsl:attribute name="class">filterselect</xsl:attribute>
              -- Select Filter --
            </xsl:if>
          </option>
        </xsl:if>
        <xsl:if test="$ctrl='inv_investigator'">
          <!-- the value is left empty on purpose -->
          <option value="" class="unasign">[Unassign]</option>
        </xsl:if>
        <xsl:apply-templates select="$fields/a:field[@id=$field-id]/a:item" mode="ddl">
          <xsl:sort select="a:sort_order" data-type="number"/>
          <xsl:sort select="a:name" data-type="text"/>
          <xsl:with-param name="value" select="$selected-value"/>
        </xsl:apply-templates>
      </select>
    </span>
  </xsl:template>

  <xsl:template match="a:item" mode="ddl">
    <xsl:param name="value"/>

    <option value="{@value}" title="{a:description}">
      <xsl:if test="string($value) and js:cleanLower(string($value)) = js:cleanLower(string(@value))">
        <xsl:attribute name="selected">selected</xsl:attribute>
      </xsl:if>
      <xsl:if test="string(a:fwd_value_field)">
        <xsl:attribute name="data-fwd-value">
          <xsl:value-of select="string(a:fwd_value_field)"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:if test="string(a:fwd_key_field)">
        <xsl:attribute name="data-fwd-key">
          <xsl:value-of select="string(a:fwd_key_field)"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:value-of select="a:name"/>
    </option>
  </xsl:template>

  <xsl:template match="a:item" mode="filter">
    <span class="fitem">
      <span class="delete" title="Remove filter item"></span>
      <label>
        <xsl:value-of select="concat(a:Label,' ', a:OperatorText)"/>
      </label>
      <input type="hidden" name="{a:ControlName}" value="{a:Value}" data-type="{a:DataType}" data-operator="{a:Operator}">
        <xsl:if test="string(a:FwdKey)">
          <xsl:attribute name="data-fwdkey">
            <xsl:value-of select="string(a:FwdKey)"/>
          </xsl:attribute>
        </xsl:if>
        <xsl:if test="string(a:FwdValue)">
          <xsl:attribute name="data-fwdvalue">
            <xsl:value-of select="string(a:FwdValue)"/>
          </xsl:attribute>
        </xsl:if>
      </input>
      <span class="display">
        <xsl:value-of select="a:Display"/>
      </span>
    </span>
  </xsl:template>

  <xsl:template match="a:sort" mode="filter">
    <input type="hidden" name="sort" data-sort-ctrl="{@sort_ctrl}" data-sort-dir="{@sort_dir}"/>
  </xsl:template>

  <msxsl:script language="JScript" implements-prefix="js">
    <![CDATA[ 
    function combinedString() {
      var p = [];
      //for(var i = 0, ii = arguments.length; i < ii; i++) {
      //  p.push( arguments[i] );
      //}
      
      return p.join( " " );
    }
   ]]>
  </msxsl:script>

</xsl:stylesheet>
