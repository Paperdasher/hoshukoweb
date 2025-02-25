import React from 'react';

function ContactPage() {
  return (
    <div>
      <h1>お問い合わせ</h1>
      <p>質問やご意見があれば、気軽に生徒会に連絡してください。</p>
      <p>生徒会顧問：大槻先生</p> {/*have feature to assign email and name as each seitokai role in database, pull data from there*/}
      <p>生徒会会長：髙橋勇登（takahashi.L141006@nyhoshuko.org）</p>
      <p>生徒会副会長：</p>
    </div>
  );
}

export default ContactPage;
