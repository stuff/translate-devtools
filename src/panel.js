const tabId = chrome.devtools.inspectedWindow.tabId;
const backgroundPageConnection = chrome.runtime.connect({
  name: 'oc-devtools-translations'
});

backgroundPageConnection.postMessage({
  name: 'init',
  tabId
});

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
    let html = '';
    html += '<table class="pure-table">';
    html += '<tbody>';
    html += '<thead><tr><th>Key</th><th>Value</th></tr></thead>';

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

    const keyKeys = Object.keys(filteredData);
    if (keyKeys.length > 0) {
      keyKeys.forEach((k, n) => {
        const val = _.escape(this.data[k]);
        const isOdd = Boolean(n % 2);
        html += `<tr ${
          isOdd ? 'class="pure-table-odd"' : ''
        }><td>${stringDecorate(k, this.filterValue)}</td><td>${stringDecorate(
          val,
          this.filterValue
        )}</td></tr>`;
      });
    } else {
      html += '<tr><td colspan="8">no keys</td></tr>';
    }

    html += '</tbody>';
    html += '</table>';

    this.element.innerHTML = html;
  }
}

const tableContainerElement = document.getElementById('keys');
const inputFilterElement = document.getElementById('input_filter');
const table = new TableKey(tableContainerElement);

inputFilterElement.addEventListener('keyup', function(event) {
  table.setFilterValue(event.target.value);
  table.render();
});

backgroundPageConnection.onMessage.addListener(function({ action, payload }) {
  if (action === 'KEY_LIST_REQUEST') {
    table.updateData(payload.keys);
  }
});

chrome.tabs.sendMessage(tabId, { action: 'KEY_LIST_REQUEST' });
