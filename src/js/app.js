(function () {
    // Read a page's GET URL variables and return them as an associative array.
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    var query = getUrlVars();
    var name = '';
    var country = '';
    var nav = '';

    for (var i = 0; i < query.length; i++) {
        if (~query[i].toLowerCase().indexOf('name')) {
            name = query[query[i]];
        }

        if (~query[i].toLowerCase().indexOf('country')) {
            country = query[query[i]];
        }

        if (~query[i].toLowerCase().indexOf('nav')) {
            nav = query[query[i]].split('|');
        }
    }

    new Vue({
        el: '#vue-app',
        data: {
            name: name || '',
            country: country || 'ru',
            checkedNav: nav ? nav : ['sub', 'lik'],
            userList: [
                {name: 'Alexander'},
                {name: 'Sasha'},
                {name: 'Aleksey'},
                {name: 'Anatoly'},
                {name: 'Andrey'},
                {name: 'Mikhail'},
                {name: 'Roman'}
            ],
            optionsList: [
                {text: 'Russia', value: 'ru'},
                {text: 'England', value: 'en'},
                {text: 'USA', value: 'us'}
            ],
            url: '',
            data: {}
        },
        computed: {
            filteredUser: function () {
                var self = this;

                return self.userList.filter(function (item) {
                    return item.name.toLowerCase().slice(0, self.name.length) === self.name.toLowerCase();
                });
            }
        },
        methods: {
            collectData: function () {
                var query = 'filter';
                var data = this.data;
                var name = this.name;
                var country = this.country;
                var checkedNav = this.checkedNav;
                var url = [];

                if (name) {
                    url.push(query + 'Name=' + name);
                    data.name = name;
                }

                if (country) {
                    url.push(query + 'Country=' + country);
                    data.country = country;
                }

                if (checkedNav.length) {
                    checkedNav = checkedNav.join('|');

                    url.push(query + 'Nav=' + checkedNav);
                    data.nav = JSON.stringify(checkedNav.split('|'));
                }

                url = url.join('&');
                url = '?' + url;

                if (this.url === url) {
                    return false
                } else {
                    this.url = url;
                }
            },
            send: function () {
                var self = this;

                self.collectData();

                // send data
                axios.post('/url', {
                    data: self.data
                }).then(function (response) {
                    console.log(response);
                    history.pushState(null, null, self.url);
                }).catch(function (error) {
                    console.log(error);
                    history.pushState(null, null, self.url);
                });
            },
            showNav: function (name) {
                var show = false;

                this.checkedNav.filter(function (item) {
                    if (item === name) {
                        show = true;
                    }
                });

                return show;
            }
        }
    });
}());