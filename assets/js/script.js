
    'use strict';
    var multiItemSlider = (function () {
      return function (selector, config) {
        var
          _mainElement = document.querySelector(selector),
          _sliderWrapper = _mainElement.querySelector('.slider__wrapper'),
          _sliderItems = _mainElement.querySelectorAll('.slider__item'),
          _sliderControls = _mainElement.querySelectorAll('.slider__control'),
          _sliderControlLeft = _mainElement.querySelector('.slider__control_left'),
          _sliderControlRight = _mainElement.querySelector('.slider__control_right'),
          _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
          _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width),
          _positionLeftItem = 0,
          _transform = 0,
          _step = _itemWidth / _wrapperWidth * 100,
          _items = [],
          _interval = 0,
          _config = {
            isCycling: false,
            direction: 'right',
            interval: 2500, // time
            pause: true // pause
          };

        for (var key in config) {
          if (key in _config) {
            _config[key] = config[key];
          }
        }

        // РЅР°РїРѕР»РЅРµРЅРёРµ РјР°СЃСЃРёРІР° _items
        _sliderItems.forEach(function (item, index) {
          _items.push({ item: item, position: index, transform: 0 });
        });

        var position = {
          getItemMin: function () {
            var indexItem = 0;
            _items.forEach(function (item, index) {
              if (item.position < _items[indexItem].position) {
                indexItem = index;
              }
            });
            return indexItem;
          },
          getItemMax: function () {
            var indexItem = 0;
            _items.forEach(function (item, index) {
              if (item.position > _items[indexItem].position) {
                indexItem = index;
              }
            });
            return indexItem;
          },
          getMin: function () {
            return _items[position.getItemMin()].position;
          },
          getMax: function () {
            return _items[position.getItemMax()].position;
          }
        }

        var _transformItem = function (direction) {
          var nextItem;
          if (direction === 'right') {
            _positionLeftItem++;
            if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
              nextItem = position.getItemMin();
              _items[nextItem].position = position.getMax() + 1;
              _items[nextItem].transform += _items.length * 100;
              _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
            }
            _transform -= _step;
          }
          if (direction === 'left') {
            _positionLeftItem--;
            if (_positionLeftItem < position.getMin()) {
              nextItem = position.getItemMax();
              _items[nextItem].position = position.getMin() - 1;
              _items[nextItem].transform -= _items.length * 100;
              _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
            }
            _transform += _step;
          }
          _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        }

        var _cycle = function (direction) {
          if (!_config.isCycling) {
            return;
          }
          _interval = setInterval(function () {
            _transformItem(direction);
          }, _config.interval);
        }

        // РѕР±СЂР°Р±РѕС‚С‡РёРє СЃРѕР±С‹С‚РёСЏ click РґР»СЏ РєРЅРѕРїРѕРє "РЅР°Р·Р°Рґ" Рё "РІРїРµСЂРµРґ"
        var _controlClick = function (e) {
          if (e.target.classList.contains('slider__control')) {
            e.preventDefault();
            var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
            _transformItem(direction);
            clearInterval(_interval);
            _cycle(_config.direction);
          }
        };

        var _setUpListeners = function () {
          // РґРѕР±Р°РІР»РµРЅРёРµ Рє РєРЅРѕРїРєР°Рј "РЅР°Р·Р°Рґ" Рё "РІРїРµСЂРµРґ" РѕР±СЂР±РѕС‚С‡РёРєР° _controlClick РґР»СЏ СЃРѕР±С‹С‚СЏ click
          _sliderControls.forEach(function (item) {
            item.addEventListener('click', _controlClick);
          });
          if (_config.pause && _config.isCycling) {
            _mainElement.addEventListener('mouseenter', function () {
              clearInterval(_interval);
            });
            _mainElement.addEventListener('mouseleave', function () {
              clearInterval(_interval);
              _cycle(_config.direction);
            });
          }
        }

        // РёРЅРёС†РёР°Р»РёР·Р°С†РёСЏ
        _setUpListeners();
        _cycle(_config.direction);

        return {
          right: function () { // РјРµС‚РѕРґ right
            _transformItem('right');
          },
          left: function () { // РјРµС‚РѕРґ left
            _transformItem('left');
          },
          stop: function () { // РјРµС‚РѕРґ stop
            _config.isCycling = false;
            clearInterval(_interval);
          },
          cycle: function () { // РјРµС‚РѕРґ cycle
            _config.isCycling = true;
            clearInterval(_interval);
            _cycle();
          }
        }

      }
    }());

    var slider = multiItemSlider('.slider', {
      isCycling: true
    })
