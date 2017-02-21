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
        localStorage.setItem('griditems', JSON.stringify(griditems.slice(1)));
        $('.grid-item').unwrap();

    });






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

    var itemqty;
    var itemprice;

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

    $(document).on('click', '.delete-item', function () {
        $(this).parent('.grid-item').remove();
    });

    $(document).on('keyup', '.item-qty', function () {
        itemqty = parseFloat($(this).val());
    });

    $(document).on('keyup', '.item-price', function () {
        itemprice = parseFloat($(this).val());
        var amount = Math.round(itemprice * itemqty).toFixed(2);

        console.log(itemqty);

        $(this).parent('div').siblings('div').find('.item-amount').text('$' + amount);

    });



});