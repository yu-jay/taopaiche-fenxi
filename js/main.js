//main.js
(function(){
	
	$('#head_pic_btn').click(function(){
		
		$.upload({
            url: $config.uploadUrl,
            fileName: 'img',
            dataType: 'json',
            onComplate: function(data){
            	console.log(data);
            }
		});
		
	});
	
})();