var _api_root = '{$_api_root}';
var api = {
    index: _api_root + 'default/index',
    default: {
        store: _api_root + 'default/store',
        index: _api_root + 'default/index',
        goods_list: _api_root + 'default/goods-list',
        cat_list: _api_root + 'default/cat-list',
        goods: _api_root + 'default/goods',
        district: _api_root + 'default/district',
        goods_attr_info: _api_root + "default/goods-attr-info",
        upload_image: _api_root + "default/upload-image",
    },
    cart: {
        list: _api_root + 'cart/list',
        add_cart: _api_root + 'cart/add-cart',
        delete: _api_root + 'cart/delete',
    },
    passport: {
        login: _api_root + 'passport/login',
        on_login: _api_root + 'passport/on-login',
    },
    order: {
        submit_preview: _api_root + 'order/submit-preview',
        submit: _api_root + 'order/submit',
        pay_data: _api_root + 'order/pay-data',
        list: _api_root + 'order/list',
        revoke: _api_root + 'order/revoke',
        confirm: _api_root + 'order/confirm',
        count_data: _api_root + 'order/count-data',
        detail: _api_root + 'order/detail',
        refund_preview: _api_root + 'order/refund-preview',
        refund: _api_root + 'order/refund',
        refund_detail: _api_root + 'order/refund-detail',
    },
    user: {
        address_list: _api_root + 'user/address-list',
        address_detail: _api_root + 'user/address-detail',
        address_save: _api_root + 'user/address-save',
        address_set_default: _api_root + 'user/address-set-default',
        address_delete: _api_root + 'user/address-delete',
        save_form_id: _api_root + "user/save-form-id",
        favorite_add: _api_root + "user/favorite-add",
        favorite_remove: _api_root + "user/favorite-remove",
        favorite_list: _api_root + "user/favorite-list",
    },
};
module.exports = api;