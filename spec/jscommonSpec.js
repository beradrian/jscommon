var jscommon = require("../src/main/js/jscommon.js");

describe("jscommon", function() {
	describe("remove", function() {
		it("should remove existing", function() {
			var arr = [1, 2, 3];
			jscommon.remove(arr, 2);
			expect(arr).toEqual([1, 3]);
		});
		it("shouldn't remove non-existing", function() {
			var arr = [1, 2, 3];
			jscommon.remove(arr, 4);
			expect(arr).toEqual([1, 2, 3]);
		});
	});

	describe("forEach", function() {
		var obj = {
			a: 1,
			b: 2,
			c: 3,
			d: function() {},
			e: new Function("return 0;")
		};
		var x = "";
		var callback = function(v, p, o) { x += p;};
		beforeEach(function() {x = "";});
		it("should iterate", function() {
			jscommon.forEach(obj, callback);
			expect(x).toEqual("abc");
		});
		it("should consider blacklist", function() {
			jscommon.forEach(obj, callback, {blacklist: ["b"]});
			expect(x).toEqual("ac");
		});
		it("should consider whitelist", function() {
			jscommon.forEach(obj, callback, {whitelist: ["b", "c"]});
			expect(x).toEqual("bc");
		});
		it("should not skip functions", function() {
			jscommon.forEach(obj, callback, {skipFunctions: false});
			expect(x).toEqual("abcde");
		});
		it("should iterate only own properties", function() {
			jscommon.forEach(obj, callback, {onlyOwnProperties: false});
			expect(x).toEqual("abc");
		});
	});
});