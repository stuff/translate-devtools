function stringDecorate(str, search) {
  if (!search) {
    return str;
  }
  const reg = new RegExp(`(${search})`);
  return str.replace(
    reg,
    '<span style="background: rgba(230, 190, 70, 0.8)">$1</span>'
  );
}

class TableKey {
  constructor(targetElement, data = {}) {
    this.data = data;
    this.element = targetElement;
    this.filterValue = null;
    this.updateHandler = () => {};
  }

  onUpdate(handler) {
    this.updateHandler = handler;
  }

  setFilterValue(value) {
    this.filterValue = value.toLowerCase() || null;
  }

  updateData(newData) {
    this.data = newData;
    this.sort();
    this.render();
  }

  sort() {
    this.data = _(this.data)
      .toPairs()
      .sortBy(0)
      .fromPairs()
      .value();
  }

  render() {
    const filteredData = _.reduce(
      this.data,
      (result, value, key) => {
        if (
          this.filterValue === null ||
          key.toLowerCase().match(new RegExp(this.filterValue)) ||
          value.toLowerCase().match(new RegExp(this.filterValue))
        ) {
          result[key] = value;
        }
        return result;
      },
      {}
    );

    this.updateHandler(filteredData);

    let html = '';
    html += `
      <table class="pure-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
    `;

    const keyKeys = Object.keys(filteredData);
    if (keyKeys.length > 0) {
      keyKeys.forEach((k, n) => {
        const val = _.escape(this.data[k]);
        const isOdd = Boolean(n % 2);

        html += `
          <tr ${isOdd ? 'class="pure-table-odd"' : ''}>
            <td>
              ${stringDecorate(k, this.filterValue)}
            </td>
            <td>
              ${stringDecorate(val, this.filterValue)}
            </td>
          </tr>
        `;
      });
    } else {
      html += `
        <tr>
          <td colspan="8">
            no keys
          </td>
        </tr>
      `;
    }

    html += `
        </tbody>
      </table>
    `;

    this.element.innerHTML = html;
  }
}

function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object') {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}
