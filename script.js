
$('a').each(function(k, v){
    if(~v.href.indexOf('tmall.com')){
        var url;
        if(~v.href.indexOf('?')){
            url = v.href + '&pid=mm_17522294_0_0&unid=0&mode=63'
        }else{
            url = v.href + '?pid=mm_17522294_0_0&unid=0&mode=63'
        }
        $(v).attr('href', url)
    }
})


if($('#J_TSearchForm').length){
    $('#J_TSearchForm').attr('action', 'http://s8.taobao.com/browse/search_auction.htm');
    $('#J_TSearchForm').append($('<input type="hidden" name="pid" value="mm_17522294_0_0"/>'))
    $('#J_TSearchForm input[name=ssid]').remove()
}
