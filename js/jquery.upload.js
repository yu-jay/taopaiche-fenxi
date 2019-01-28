var onChooseFile = ''; (function($) {
    var noop = function(){
        return true;
    };
    var frameCount = 0;
    var imgName = '';
    $.uploadDefault = {
        url: '',
        fileName: 'filedata',
        dataType: 'json',
        params: {},
        onSend: noop,
        exten: [],
        onComplate: noop
    };

    $.upload = function(options) {
        var opts = $.extend(jQuery.uploadDefault, options);
        if (opts.url == '') {
            return;
        }

        var canSend = opts.onSend();
        if (!canSend) {
            return;
        }

        var frameName = 'upload_frame_' + (frameCount++);
        var iframe = $('<iframe style="position:absolute;height:0;width:0;" name="'+frameName+'" />');
        var form = $('<form method="post" style="display:none;" target="'+frameName+'" action="'+opts.url+'"  name="form_'+frameName+'" enctype="multipart/form-data" />');
        // 选中文件, 提交表单(开始上传)
        upFile = function(fileInputDOM) {
            imgName = fileInputDOM.value;
            var extension = imgName.match(/\.[^\.]+$/)[0].toLowerCase(),ontest=false;
            if (options.exten !== undefined) {
                for(var i=0;i<options.exten.length;i++){
                    if( extension===options.exten[i] ){
                        ontest=true;
                    };
                };
                if(!ontest){
                    new Tips({
                        "tipscon": "格式为" + options.exten.join("，") + "，请重新选择！"
                    });
                    opts.ie8&&parElement.append(oldElement)
                    return false;
                };                 
            };
            form.submit(); 
            
        };
        var oldElement,parElement,fileInput;
        if(opts.ie8){
            oldElement = $('#' + opts.fileElementId),parElement=oldElement.parent();
            $(oldElement).appendTo(form);
        }else{
            // form中增加数据域
            var formHtml = '<input type="file" name="' + opts.fileName + '" onchange="upFile(this)">';
            for (key in opts.params) {
                formHtml += '<input type="hidden" name="' + key + '" value="' + opts.params[key] + '">';
            }
            form.append(formHtml);
        }
        
        $(document.body).append(form).append(iframe);
        opts.ie8&&upFile(oldElement[0]);
        // iframe 在提交完成之后
        iframe.load(function() {
            var data = $(this).contents().find('body').html();
            opts.onComplate(data, imgName); 
            if(!data) return false;
            setTimeout(function() {
                opts.ie8&&parElement.append(oldElement)
                iframe.remove();
                form.remove();
            },300);          
        });

        // 文件框
        if(!opts.ie8){
            fileInput = $('input[type=file][name=' + opts.fileName + ']', form);
            fileInput.click();
        }
        
    };
})(jQuery);