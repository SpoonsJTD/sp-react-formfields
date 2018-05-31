var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { sp } from '@pnp/sp';
import { initStore } from 'react-waterfall';
import { FormMode } from './interfaces';
import { FieldPropsManager } from './managers/FieldPropsManager';
var store = {
    initialState: {
        SPWebUrl: null,
        CurrentMode: 0,
        CurrentListId: null,
        IsLoading: true
    },
    actions: {
        initStore: function (state, sPWebUrl, currentListId, currentMode, currentItemId) { return __awaiter(_this, void 0, void 0, function () {
            var list, listFields, toSelect, toExpand, _i, listFields_1, f, fieldInfos, item_1, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        configurePnp(sPWebUrl);
                        list = sp.web.lists.getById(currentListId);
                        return [4, list
                                .fields
                                .filter('ReadOnlyField eq false and Hidden eq false and Title ne \'Content Type\'').get()];
                    case 1:
                        listFields = _c.sent();
                        toSelect = [];
                        toExpand = [];
                        for (_i = 0, listFields_1 = listFields; _i < listFields_1.length; _i++) {
                            f = listFields_1[_i];
                            if (f.TypeAsString.match(/user/gi)) {
                                toSelect.push(f.EntityPropertyName + "/Title");
                                toSelect.push(f.EntityPropertyName + "/Id");
                                toExpand.push(f.EntityPropertyName);
                            }
                            else if (f.TypeAsString.match(/lookup/gi)) {
                                toSelect.push(f.EntityPropertyName + "/Title");
                                toSelect.push(f.EntityPropertyName + "/Id");
                                toExpand.push(f.EntityPropertyName);
                            }
                            else {
                                toSelect.push(f.EntityPropertyName);
                            }
                        }
                        fieldInfos = [];
                        if (!(currentMode !== FormMode.New)) return [3, 3];
                        return [4, (_a = (_b = list.items.getById(currentItemId)).select.apply(_b, toSelect)).expand.apply(_a, toExpand).get()];
                    case 2:
                        item_1 = _c.sent();
                        fieldInfos = listFields.map(function (fm) {
                            return FieldPropsManager.createFieldRendererPropsFromFieldMetadata(fm, currentMode, item_1, sp);
                        });
                        return [3, 4];
                    case 3:
                        fieldInfos = listFields.map(function (fm) {
                            return FieldPropsManager.createFieldRendererPropsFromFieldMetadata(fm, currentMode, null, sp);
                        });
                        _c.label = 4;
                    case 4: return [2, {
                            PnPSPRest: sp,
                            SPWebUrl: sPWebUrl,
                            CurrentListId: currentListId,
                            CurrentItemId: currentItemId,
                            CurrentMode: currentMode,
                            Fields: fieldInfos,
                            IsLoading: false
                        }];
                }
            });
        }); },
        setFormMode: function (state, mode) {
            console.log(state);
            state.CurrentMode = mode;
            state.Fields.forEach(function (f) { return f.CurrentMode = mode; });
            console.log(state);
            return state;
        },
        setFieldData: function (state, internalName, newValue) {
            var filtered = state.Fields.filter(function (f) { return f.InternalName === internalName; });
            if (filtered && filtered.length > 0) {
                filtered[0].FormFieldValue = newValue;
            }
            return state;
        }
    }
};
var getFieldControlValuesForPost = function () {
    var state = initedStore.getState();
    var toReturn = {};
    for (var _i = 0, _a = state.Fields; _i < _a.length; _i++) {
        var fp = _a[_i];
        if (fp.Type.match(/user/gi) || fp.Type.match(/lookup/gi)) {
            var result = null;
            if (fp.FormFieldValue != null) {
                if (!fp.IsMulti) {
                    result = parseInt(fp.FormFieldValue.Id);
                }
                else {
                    if (fp.FormFieldValue.results != null && fp.FormFieldValue.results.length > 0) {
                        result = { results: fp.FormFieldValue.results.map(function (r) { return parseInt(r.Id); }) };
                    }
                    else {
                        result = { results: [] };
                    }
                }
            }
            toReturn[fp.EntityPropertyName + "Id"] = result;
        }
        else {
            toReturn[fp.EntityPropertyName] = fp.FormFieldValue == null ? undefined : fp.FormFieldValue;
        }
    }
    return toReturn;
};
var configurePnp = function (webUrl) {
    sp.setup({
        sp: {
            headers: {
                Accept: 'application/json;odata=verbose'
            },
            baseUrl: webUrl
        }
    });
};
var initedStore = initStore(store);
export var FormFieldsStore = __assign({}, initedStore, { getFieldControlValuesForPost: getFieldControlValuesForPost });
//# sourceMappingURL=store.js.map