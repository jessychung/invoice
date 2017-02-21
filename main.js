$(function () {

    var addlinebutton = $('#AddLineItem');
    var deletelinebutton = $('.delete-item');

    var newitem = `<div class="row grid-item">
                   <div class="col-md-6">
                   <input type="text" class="form-control grid-input" placeholder="Enter Item Description"></div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-qty">
                    </div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-price">
                    </div>
                    <div class="col-md-2">
                        <span class="item-amount">$0.00</span>
                    </div>
                    <div class="delete-item">
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </div>
                    </div>`;

    var itemqty;
    var itemprice;

    addlinebutton.click(function () {
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