$(function () {
   $('.your-logo').droppable({
       drop: function () {
         console.log('dropped');
       }
   })
});