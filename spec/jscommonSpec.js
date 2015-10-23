var jscommon = require("../src/main/js/jscommon.js");

describe("jscommon", function() {
	describe("removeElementFromArray", function() {
		it("should remove existing", function() {
			var arr = [1, 2, 3];
			jscommon.removeElementFromArray(arr, 2);
			expect(arr).toEqual([1, 3]);
		});
		it("shouldn't remove non-existing", function() {
			var arr = [1, 2, 3];
			jscommon.removeElementFromArray(arr, 4);
			expect(arr).toEqual([1, 2, 3]);
		});
	});
});