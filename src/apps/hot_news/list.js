$require('/detail.js');

$class('hot_news.ListController').extend(tau.ui.TableSceneController).define({
  /**
   * 
   * @param opts
   */
  ListController: function(opts) {
    this.url = opts.url;
  },

  /**
   * 
   */
  init: function() {
    this.appCtx = tau.getCurrentContext();
    hot_news.ListController.$super.init.apply(this, arguments);
    var table1 = new tau.ui.Table({
          listSize : 10 , 
          indicator: true, 
          moreCell : true , 
          styles : {
                backgroundColor: '#F6F6F6', 
                color: '#363636', 
                fontFamily: 'sans-serif', 
                position: 'absolute', 
                top: '56px'
           }
    });
    this.getScene().add(table1);
  },
  
  sceneLoaded: function () {
    var scene = this.getScene();
    var panel1 = new tau.ui.Panel({styles : {textAlign: 'center', width: '100%'}});
    scene.add(panel1);
    var imageView1 = new tau.ui.ImageView({src : '/img/hot_news.png' , styles : {height: '50px'}});
    panel1.add(imageView1);
    var panel2 = new tau.ui.Panel({styles : {backgroundImage: '-webkit-gradient(linear, left top, left bottom,from(#C7C7C7),color-stop(83%,#D6D6D6),to(#B6B6B6))', height: '6px', width: '100%'}});
    scene.add(panel2);
    hot_news.ListController.$super.sceneLoaded.apply(this, arguments);
  },

  /**
   * 
   * @param start
   * @param size
   */
  loadModel: function(start, size) {
    var table = this.getTable();
    var max = start + size;

    function load(resp) {
      if (resp.status === 200) {
        this.feed = resp.responseJSON.query.results.item;
        size = (max < this.feed.length) ? size : this.feed.length - start;
        table.addNumOfCells(size);
      } else {
        table.endActivityIndicator();
        tau.confirm('<br> Response error: status=' + resp.status + ' msg=' + resp.statusText + '<br><br> 재시도 하시겠습니까?', {
          title: 'Error',
          callbackFn: function(returnVal){
            table.endActivityIndicator();
            if (returnVal) table.loadModel(true);
          }
        });
      }
    }

    tau.req({
      type: 'JSONP',
      jsonpCallback: 'callback', // yql 의 callback function 을 지정하는 parameter key
      url: this.url,
      timeout: 20000,
      callbackFn: tau.ctxAware(load, this)
    }).send();
  },

  /**
   * 
   * @param index
   * @param offset
   * @returns {tau.ui.TableCell}
   */
  makeTableCell: function(index, offset) {
    var cell = new tau.ui.TableCell();
    cell.setTitle(this.feed[offset + index].title);
    return cell;
  },

  /**
   * 
   * @param current
   * @param before
   */
  cellSelected: function(current, before) {
    var table = this.getTable();
    var index = table.indexOf(current);
    var article = this.feed[index[0]];
    var navigator = this.getParent();
    navigator.pushController(new hot_news.DetailController(article));
    // navigator.setHideNavigationBar(false); // 동작하지 않는다.
  }
});