#!/usr/bin/env node
var bestroutetb = require('bestroutetb');
var _ = require('lodash');
var fs = require('fs');

var country = process.argv[2] || 'cn';
var subnets = bestroutetb.Db.getInstance().getPrefixesOfCountry(country);

function toIPv4(v) {
  var parts = [];
  for (var i = 24; i >= 0; i -= 8)
    parts.push((v >>> i) & 0xff);
  return parts.join('.');
}

var lines = '';
for (var i = 0, l = subnets.length; i < l; i++) {
  var subnet = subnets[i];
  var prefix = toIPv4(subnet.prefix);
  lines += `-A SHADOWSOCKS -d ${prefix}/${subnet.length} -j RETURN\n`;
}

var template = fs.readFileSync(`${__dirname}/_iptables`);
var compiled = _.template(template);
process.stdout.write(compiled({country, lines}));
