!
function(e) {
	function t(t, n) {
		return e("<" + (n || "div") + "/>").addClass(t)
	}
	function n(n) {
		var i = n.selectedIndex,
			s = 0 > i ? "" : n.options[i].innerHTML,
			c = e(n).prev(".select_text_ui");
		c.length || (c = t("select_text_ui").insertBefore(n)), s = s || "&nbsp;", c.html() != s && c.html(s);
		var o = 0;
		e.each(n.options, function() {
			var e = this.label || this.innerText || this.textContent || this.innerHTML,
				t = e.match(/[u0000-u00FF]/g);
			t = e.length - (t ? t.length / 2 : 0) + .5, o = Math.max(t, o)
		}), o += "", 7 > l && "complete" == document.readyState && (c.css(r, ""), "auto" != c.css(r)) || c.css(r) != o && c.css(r, o)
	}//o += "em"
	function i(t) {
		c ? c.push(t) : (c = [t], clearInterval(o), o = setInterval(function() {
			e.each(c, function() {
				(s || document.activeElement) !== this && n(this)
			})
		}, 200))
	}
	var s, c, o, u, l = function(e, t) {
			return "XMLHttpRequest" in e ? t.querySelector ? t.documentMode : 7 : 6
		}(top, top.document),
		r = 7 > l ? "width" : "minWidth";
	8 > l && (u = function() {
		function n(t, n) {
			t.find(".select_menu_ui").length || (t.bind("selectstart", function(e) {
				return e.stopImmediatePropagation(), !1
			}).click(function() {
				var e = t.find(".select_menu_ui");
				e.position().left < 0 ? l(t, e, n) : u(t, e), t.addClass("select_focus_ui")
			}), e(n).focus(function() {
				t.addClass("select_focus_ui")
			}).blur(function() {
				o()
			}), i(t, n))
		}
		function i(n, i) {
			return c(t("select_menu_ui"), i).appendTo(n).hover(function() {
				e(this).width(this.clientWidth)
			}, function() {
				e(this).width("")
			})
		}
		function c(n, i) {
			return n.html(""), e.each(i.options, function(s) {
				var c = this;
				t("option_ui").html(c.innerHTML + "&nbsp;").click(function() {
					return c.disabled ? !1 : (i.selectedIndex = s, e(i).trigger("change"), void 0)
				}).bind("mouseenter", function() {
					c.disabled || e(this).addClass("option_hover_ui").siblings().removeClass("option_hover_ui")
				}).css({
					color: c.disabled ? "gray" : ""
				}).appendTo(n)
			}), n.children().eq(i.selectedIndex).addClass("option_hover_ui"), n.css("left", "-99999em")
		}
		function o(t) {
			var n = e(".select_ui");
			t && t.length ? n = n.not(t) : s = null, n.each(function() {
				var t = e(this);
				t.removeClass("select_focus_ui"), u(t)
			})
		}
		function u(e, t) {
			e.css({
				zIndex: ""
			}), (t || e.find(".select_menu_ui")).css("left", "-99999em")
		}
		function l(e, t, n) {
			s = n, o(e), c(t, n), e.css({
				zIndex: 65535
			}), t.css({
				left: 0
			})
		}
		return e(document).click(function(t) {
			o(e(t.target).closest(".select_ui"))
		}), n
	}()), e.fn.selectui = function() {
		return this.each(function() {
			var s, c = e(this),
				o = c.closest(".select_ui");
			"none" !== c.css("display") && (o.length || (o = t("select_ui", "span"), o.insertAfter(c).append(t("select_arrow")).append(c)), c.bind("change propertychange DOMAttrModified DOMNodeInserted DOMNodeRemoved keypress", function() {
				clearTimeout(s);
				var e = this;
				s = setTimeout(function() {
					n(e)
				}, 10)
			}).each(function() {
				n(this)
			}), u ? u(o, this) : c.focus(function() {
				o.addClass("select_focus_ui")
			}).blur(function() {
				o.removeClass("select_focus_ui")
			}), i(this))
		})
	}, e(function() {
		document.querySelector ? e("select").selectui() : e("select:not(.profile select)").selectui()
	})
}(jQuery);