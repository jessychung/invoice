$(function () {

    var addlinebutton = $('#AddLineItem');
    var deletelinebutton = $('.delete-item');
    var saveInvoice = $('#saveInvoice');

    //datepicker
    $( "#invoicedate" ).datepicker();
    $( "#duedate" ).datepicker();



    var idCount = 0;


    var storedItems = JSON.parse(localStorage.getItem('griditems'));
    console.log(storedItems);


    if(storedItems) {
        for(var i = 0; i < storedItems.length; i++) {
            idCount++;
            var itemid = storedItems[i].id;
            var itemhtml = storedItems[i].value;
            $('.grid').append(itemhtml);
        }
    }

    $('input').each(function(){
        var id = $(this).attr('id');
        var value = localStorage.getItem(id);
        if($(this).is('[readonly]')) {

        } else {
            $(this).val(value);
        }

    });

    // $(document).on('keyup change', 'input', function () {
    //     $('input').each(function () {
    //         var id = $(this).attr('id');
    //         var value = $(this).val();
    //         localStorage.setItem(id, value);
    //     });
    // });


    // $('.grid-item').each(function() {
    //     $(this).attr('id', 'item' + idCount);
    //
    // });

    saveInvoice.on('click', function () {
        $('input').each(function () {
            var id = $(this).attr('id');
            var value = $(this).val();
            localStorage.setItem(id, value);
        });
        var griditems = [];
        $('.grid .grid-item').each(function () {
            var id = $(this).attr('id');
            var eachitem = {
                id: id,
                value: $(this).wrap('<p/>').parent().html()
            };
            griditems.push(eachitem);
        })
        localStorage.setItem('griditems', JSON.stringify(griditems));
        $('.grid-item').unwrap();

    });



    var newitem = `<div class="row grid-item" id="griditem">
                   <div class="col-md-6">
                   <input type="text" class="form-control grid-input" placeholder="Enter Item Description" id="item"></div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-qty" id="qty">
                    </div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-price" id="price">
                    </div>
                    <div class="col-md-2">
                        <span class="item-amount">$0.00</span>
                    </div>
                    <div class="delete-item">
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </div>
                    </div>`;

    if($('.grid').children().length == 0) {
        $('.grid').append(newitem);
    }



    addlinebutton.click(function () {
        idCount++;
        var newitem = `<div class="row grid-item" id="griditem${idCount}">
                   <div class="col-md-6">
                   <input type="text" class="form-control grid-input" placeholder="Enter Item Description" id="item${idCount}"></div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-qty" id="qty${idCount}">
                    </div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-price" id="price${idCount}">
                    </div>
                    <div class="col-md-2">
                        <span class="item-amount">$0.00</span>
                    </div>
                    <div class="delete-item">
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </div>
                    </div>`;
        $('.grid').append(newitem);
    });



    $(document).on('mouseenter', '.grid-item', function()
    {
        if($('.grid-item').length === 1) {
            $(this).find('.delete-item').hide();
        } else {
            $(this).find('.delete-item').show();
        }

    }).on('mouseleave', '.grid-item', function () {
        $(this).find('.delete-item').hide();
    });

    var count = 0;

    $(document).on('click', '.delete-item', function () {
        $(this).parent('.grid-item').remove();
        $('.grid-item').each(function () {
            count++;
            $(this).attr('id', `griditem${count}`);
            $(this).find('.item-qty').attr('id', `qty${count}`);
            $(this).find('.item-price').attr('id', `price${count}`);
        })


    });

    $(document).on('keyup change', '.item-qty', function () {

        var itemprice = parseFloat($(this).parent().siblings('div').find('.item-price').val());
        var itemqty = parseFloat($(this).val());

        if(!itemprice) {
            itemprice = 0;
        } else {
            itemprice = parseFloat($(this).parent().siblings('div').find('.item-price').val());
        }

        if(!itemqty) {
            itemqty = 0;
        } else {
            itemqty = parseFloat($(this).val());
        }

        console.log(itemprice);
        console.log(itemqty);

        var amount = Math.round(itemprice * itemqty).toFixed(2);
        $(this).parent('div').siblings('div').find('.item-amount').text('$' + amount);
    });

    $(document).on('keyup change', '.item-price', function () {

        var itemprice = parseFloat($(this).val());
        var itemqty = parseFloat($(this).parent().siblings('div').find('.item-qty').val());

        if(!itemprice) {
            itemprice = 0;
        } else {
            itemprice = parseFloat($(this).val());
        }

        if(!itemqty) {
            itemqty = 0;
        } else {
            itemqty = parseFloat($(this).parent().siblings('div').find('.item-qty').val());
        }

        console.log(itemprice);
        console.log(itemqty);

        var amount = Math.round(itemprice * itemqty).toFixed(2);
        $(this).parent('div').siblings('div').find('.item-amount').text('$' + amount);
    });



});