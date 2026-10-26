'use strict';
// 公開用の説明データ。パスはドメインを含めず、データ例は使わない。
const screens = [
 ['login','ログイン','/login','未ログインのスタッフ','アプリの入口 → 予約から転送'],
 ['calendar','予約','/calendar','経営者：全店／店長・スタイリスト：所属店','ログイン後・ナビ「予約」'],
 ['absences','不在・影響する予約','/absences','本人・所属が重なるスタッフ・経営者','予約の「不在」。影響一覧の「引継ぎ」で同じ画面にフォーム'],
 ['customers','お客様','/customers','認証済み。カルテ一覧は持ち主・有効な共有等の範囲。登録は所属店／経営者','ナビ「お客様」・予約の「お客様」'],
 ['chart','カルテ','/customers/[customerId]','持ち主・有効な共有／引継ぎ／承認された代打／閲覧を残した元担当','お客様の検索結果・予約詳細「カルテ」・会計の「詳しく」'],
 ['last','前回','/customers/[customerId]/last','カルテを閲覧できる人','カルテの「前回」'],
 ['show','見せる','/customers/[customerId]/show','認証済みでカルテを閲覧できるスタッフ。お客様用ログインではない','カルテの「見せる」。日付と写真を表示、スタッフナビなし'],
 ['checkout','お会計','/store/[storeId]/checkout','経営者・所属店スタッフ。保存は記録作成の権限がある人だけ','ナビ「レジ」（所属がある場合）。幅600px以下では「会計」「仕訳」「今月」を同じURLのクエリで切り替え'],
 ['cash','レジ締め・入金','/store/[storeId]/cash','経営者・対象店の店長','お会計の「締め」（表示対象者のみ）'],
 ['me','自分の成績','/me','本人の成績・目標・売上・経費・道具・給与','ナビ「自分」・共通の会計ナビ「自分」。月表示ではダッシュボードも表示'],
 ['shares','共有・引継ぎの管理','/me/shares','認証済み。自分の共有・引継ぎ・代打の範囲','自分の画面の「共有」'],
 ['consents','開示への同意','/me/consents','本人の同意を設定。経営者も本人用の画面を開ける','自分・会社の「同意」'],
 ['notifications','通知の設定','/me/notifications','本人のみ。利用可否は設定状況による','自分の画面の「通知」'],
 ['portfolio','自分の作品','/portfolio','本人の作品。公開範囲の拡大は同意等の条件あり','ナビ「作品」・自分の「作品」'],
 ['colleague','同僚の作品','/portfolio/of/[id]','有効に共有され、公開範囲と同意の条件を満たす作品だけ','対象スタッフのURLで開く。現行の共有一覧には直接リンクなし'],
 ['customer-view','作品をお客様へ','/portfolio/customer-view','本人の「お客様に見せる」作品で同意条件を満たすもの','作品の「お客様へ」。スタッフナビなし'],
 ['expenses','経費','/expenses','本人の経費。経営者は他のスタッフ分も閲覧・条件に応じ起票','ナビ「経費」。一覧上部に「入力」、経営者には「固定資産」。対象の下書きに「起票」'],
 ['expense-new','経費の入力','/expenses/new','本人の経費を入力','経費の「入力」→「会社」か「自分」を選択'],
 ['company','会社の損益・貸借・帳簿','/company','経営者は全体。社員は同意のそろった段まで。仕訳は本人行の範囲もある','ナビ「会社」・共通の会計ナビ「会社」'],
 ['bank','口座','/company/bank','経営者のみ','会社の帳簿内「口座」の見出し（経営者で帳簿と口座を取得できた場合）'],
 ['spend','お客様の年額','/company/customers','経営者のみ。氏名・担当・額。カルテ本文は含まない','会社の「お客様」'],
 ['staff-summary','社員別の集計','/company/staff/[id]','経営者は対象社員分。本人のIDなら本人分も可','会社の売上帰属の社員リンク（経営者）'],
 ['assets','固定資産','/company/assets','操作・データは経営者のみ。ほかは権限なし表示','会社の「固定資産」・経費の「固定資産」'],
 ['leases','リース','/company/leases','操作・データは経営者のみ。ほかは権限なし表示','会社の「リース」'],
 ['payroll','給与の起票','/company/payroll','経営者のみ。社員は拒否。本人の給与は「自分」で閲覧','会社の「給与」'],
 ['disclosure','開示状況','/company/disclosure','データは経営者のみ。社員には拒否の理由を表示','会社の「開示」'],
 ['print','予約表の印刷','/print/daily','経営者：全店／店長・スタイリスト：所属店','予約の「印刷」。店舗と日付を選択、スタッフナビなし']
];

const rows = document.getElementById('screen-rows');
screens.forEach(([id, name, url, scope, entry]) => {
  const tr = document.createElement('tr');
  tr.id = `screen-${id}`;
  const title = document.createElement('th'); title.scope = 'row';
  const small = document.createElement('small'); small.textContent = id;
  title.append(small, document.createTextNode(name)); tr.append(title);
  [url, scope, entry].forEach((value, i) => {
    const td = document.createElement('td');
    td.dataset.label = ['URL','閲覧範囲','入口・操作'][i];
    if (i === 0) { const code = document.createElement('code'); code.textContent = value; td.append(code); }
    else td.textContent = value;
    tr.append(td);
  }); rows.append(tr);
});
// 小さい画面では列見出しを各セルにも表示する。
document.querySelectorAll('table').forEach(table => {
  const labels = [...table.querySelectorAll('thead th')].map(th => th.textContent);
  table.querySelectorAll('tbody tr').forEach(tr => [...tr.children].forEach((cell, i) => {
    if (cell.tagName === 'TD') cell.dataset.label = labels[i];
  }));
});

const select = document.getElementById('screen-select');
const gallery = document.getElementById('image-gallery');
const deviceNames = {pc:'PC', ipad:'iPad', phone:'スマホ'};
screens.forEach(([id,name]) => { const option = document.createElement('option'); option.value = id; option.textContent = `${name}（${id}）`; select.append(option); });
select.value = 'calendar';
screens.forEach(([id,name]) => Object.entries(deviceNames).forEach(([device,label]) => {
  const figure = document.createElement('figure'); figure.className = 'shot'; figure.dataset.screen = id; figure.dataset.device = device; figure.hidden = true;
  const caption = document.createElement('figcaption');
  const title = document.createElement('b'); title.textContent = name;
  const width = document.createElement('span'); width.textContent = `${label} ／ ${id}`; caption.append(title,width);
  const body = document.createElement('div'); body.className = 'shot-body';
  const img = document.createElement('img'); img.alt = `${name}の${label}表示`; img.loading = 'lazy';
  const placeholder = document.createElement('div'); placeholder.className = 'placeholder'; placeholder.hidden = true;
  const symbol = document.createElement('span'); symbol.className = 'placeholder-symbol'; symbol.textContent = '▧'; symbol.setAttribute('aria-hidden','true');
  const message = document.createElement('b'); message.textContent = '画像未登録';
  const description = document.createElement('span'); description.textContent = `${name} ／ ${label}`;
  const file = document.createElement('code'); file.textContent = `images/${id}-${device}.png`;
  placeholder.append(symbol,message,description,file);
  img.addEventListener('load',() => {img.hidden=false;placeholder.hidden=true;});
  img.addEventListener('error',() => {img.hidden=true;placeholder.hidden=false;});
  img.setAttribute('src', `images/${id}-${device}.png`);
  body.append(img,placeholder); figure.append(caption,body); gallery.append(figure);
}));
let currentDevice = 'pc';
function showImage() {
  gallery.querySelectorAll('.shot').forEach(figure => {figure.hidden = figure.dataset.screen !== select.value || figure.dataset.device !== currentDevice;});
}
select.addEventListener('change', showImage);
document.querySelectorAll('[data-device][aria-pressed]').forEach(button => button.addEventListener('click',() => {
  currentDevice = button.dataset.device;
  document.querySelectorAll('[data-device][aria-pressed]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
  showImage();
}));
showImage();
