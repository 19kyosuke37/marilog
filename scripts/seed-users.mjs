/**
 * MARILOG ダミーユーザー投入スクリプト
 *
 * 使い方:
 *   SUPABASE_SERVICE_ROLE_KEY=<your-key> node scripts/seed-users.mjs
 *
 * service_role キーは Supabase ダッシュボード > Settings > API から取得できます。
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://aefwahvyhkagkcjhvnuu.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY が設定されていません')
  console.error('   実行例: SUPABASE_SERVICE_ROLE_KEY=xxxx node scripts/seed-users.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ────────────────────────────
// ユーザー定義
// ────────────────────────────
const USERS = [
  {
    email: 'seed.misaki@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: '美咲',
      gender: '女性',
      age: 31,
      user_type: 'married',
      // 現在の状況
      current_age: 31,
      current_income: 460,
      current_household_income: 1010,
      current_savings: 520,
      current_kids_count: 1,
      current_note: '育休から復帰しました。夫との家事分担は少しずつ改善されてきています。子育てと仕事の両立は大変ですが、充実しています。',
    },
    senpai: {
      age_at_marriage: 28,
      partner_age_at_marriage: 30,
      income_at_marriage: 420,
      saving_at_marriage: 480,
      partner_income_at_marriage: 550,
      partner_saving_at_marriage: 320,
      cohabitation: 'yes',
      cohabitation_period: '半年〜1年',
      area: '首都圏（東京・神奈川・埼玉・千葉）',
      dating_period: '2〜3年',
      marriage_triggers: ['年齢的なタイミング', '相手への安心感'],
      satisfaction: 4,
      current_status: '結婚継続中',
      reflection: '自分の時間は確実に減る。でもパートナーとの信頼感が深まって、精神的には安定した。育児でお互いの本音が出るので、それを乗り越えるとさらに絆が強くなると思う。',
      message_to_undecided: '家事分担について、結婚前にしっかり話し合っておくべきだった。でも総じて結婚してよかったと思っています。',
      engagement_ring: 30,
      wedding_ring: 22,
      wedding_cost: 280,
      honeymoon_cost: 38,
      has_kids: 'yes',
      kids_count: 1,
      first_child_year: 2,
      first_child_saving: 300,
    },
    posts: [
      {
        post_type: 'married',
        concern_tags: ['家事・育児の分担'],
        body: '育休明けに職場復帰したんですが、夫がまだ家事を覚えてくれていなくて毎日イライラしています。「手伝う」という言葉も気になって…。どうすれば意識が変わってもらえますか？同じ経験をした方のお話を聞きたいです。',
      },
      {
        post_type: 'married',
        concern_tags: ['義実家・親族関係'],
        body: '義母が月に2〜3回来たがります。夫は断れない性格で、私が「いいよ」と言うのを待っている感じ。来るたびに家の中を片付けるのが疲れました。みなさんどう対処されていますか？',
      },
    ],
  },
  {
    email: 'seed.kenta@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'けんた',
      gender: '男性',
      age: 33,
      user_type: 'married',
      // 現在の状況
      current_age: 33,
      current_income: 680,
      current_household_income: 1050,
      current_savings: 450,
      current_kids_count: 2,
      current_note: '課長になってから収入が上がりました。子どもが2人になって賑やかですが、仕事との両立が課題です。',
    },
    senpai: {
      age_at_marriage: 29,
      partner_age_at_marriage: 27,
      income_at_marriage: 570,
      saving_at_marriage: 380,
      partner_income_at_marriage: 360,
      partner_saving_at_marriage: 250,
      cohabitation: 'no',
      cohabitation_period: null,
      area: '関西圏（大阪・京都・兵庫）',
      dating_period: '3〜5年',
      marriage_triggers: ['相手への安心感', '子どもが欲しい'],
      satisfaction: 5,
      current_status: '結婚継続中',
      reflection: '結婚してよかったことしかない。二人でいるとポジティブになれる。仕事が辛い時期も妻がいたから乗り越えられた。',
      message_to_undecided: '「完璧なタイミング」を待ちすぎないで。一緒にいると自然体でいられる人なら、踏み出す価値がある。',
      engagement_ring: 40,
      wedding_ring: 25,
      wedding_cost: 310,
      honeymoon_cost: 45,
      has_kids: 'yes',
      kids_count: 2,
      first_child_year: 1,
      first_child_saving: 280,
    },
    posts: [
      {
        post_type: 'married',
        concern_tags: ['お金・家計'],
        body: '子ども2人になってから本当にお金の出が多くて。保育料、習い事、医療費…。固定費を見直したいんですが、先輩パパさん・ママさんどうやって家計管理されてますか？ 参考にしたいです。',
      },
      {
        post_type: 'married',
        concern_tags: ['仕事とのバランス'],
        body: '課長になってから毎日22時帰りが続いています。妻も正社員で子育てしてくれているのに、週末しか子どもに関われていない。同じような状況だった方、どうやってバランスを取りましたか？',
      },
    ],
  },
  {
    email: 'seed.yuri@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'ゆりっぺ',
      gender: '女性',
      age: 38,
      user_type: 'married',
      // 現在の状況
      current_age: 38,
      current_income: 360,
      current_household_income: 1100,
      current_savings: 920,
      current_kids_count: 0,
      current_note: '子どもはいませんが、二人の生活を充実させることに集中しています。夫との関係も少しずつ改善中。',
    },
    senpai: {
      age_at_marriage: 32,
      partner_age_at_marriage: 35,
      income_at_marriage: 310,
      saving_at_marriage: 820,
      partner_income_at_marriage: 720,
      partner_saving_at_marriage: 450,
      cohabitation: 'yes',
      cohabitation_period: '1〜2年',
      area: '東海（愛知・静岡・岐阜）',
      dating_period: '1〜2年',
      marriage_triggers: ['年齢的なタイミング', '経済的な安定'],
      satisfaction: 3,
      current_status: '結婚継続中',
      reflection: '結婚後に価値観のズレが出てきた。付き合い中にもっとリアルな話をしておけば良かった。でも今は向き合い続けることで少しずつ関係が改善している。',
      message_to_undecided: '「好き」だけじゃなく「一緒にいてラクかどうか」を重視してほしい。結婚生活はずっと続くから。',
      engagement_ring: 25,
      wedding_ring: 18,
      wedding_cost: null,
      honeymoon_cost: 28,
      has_kids: 'no',
      kids_count: null,
      first_child_year: null,
      first_child_saving: null,
    },
    posts: [
      {
        post_type: 'married',
        concern_tags: ['コミュニケーション不足'],
        body: '結婚7年目。最近夫との会話が「今日の夕飯何？」くらいになってきました。子どもがいないせいもあるのかな。夫婦仲を立て直した経験がある方、きっかけを教えてもらえますか？',
      },
      {
        post_type: 'married',
        concern_tags: ['セックスレス'],
        body: '40代目前でやっとこのことを話せる場所を見つけました。結婚4年目からレス気味で、夫に切り出せないまま3年経ちました。どうやって解決のきっかけを作りましたか？ 誰かに聞いてほしくて。',
      },
    ],
  },
  {
    email: 'seed.takuya@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'たくや',
      gender: '男性',
      age: 26,
      user_type: 'before',
      anxiety_level: 4,
      concern_tags: ['お金・貯金が不安', 'タイミングがわからない'],
      needed_savings: 400,
      ring_budget: 25,
      work_plan: 'ふたりとも正社員継続',
      kids_plan: 'ほしい',
      worry_note: '毎月少しずつ貯金を増やしています。彼女ともお金の話ができるようになってきました。焦らずに準備を進めていきたいです。',
    },
    posts: [
      {
        post_type: 'before',
        concern_tags: ['お金・貯金が不安'],
        body: '26歳・手取り22万・貯金130万ほどです。彼女から「そろそろ結婚したい」と言われているんですが、正直貯金が少なくて不安で。みなさんが結婚された時、いくら貯金ありましたか？参考にしたいです。',
      },
      {
        post_type: 'before',
        concern_tags: ['タイミングがわからない'],
        body: '付き合って1年7ヶ月。彼女も結婚を意識していると思うんですが、誰がどのタイミングで切り出せばいいのか全然わからない。プロポーズのタイミングってどうやって決めましたか？',
      },
    ],
  },
  {
    email: 'seed.sakura@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'さくら',
      gender: '女性',
      age: 28,
      user_type: 'before',
      anxiety_level: 3,
      concern_tags: ['子どものこと', '仕事とのバランス'],
      needed_savings: 500,
      ring_budget: 30,
      work_plan: '自分が時短・パートに',
      kids_plan: 'ほしい',
      worry_note: '仕事と育児の両立について、先輩ママたちの経験を参考にしたいです。キャリアを手放したくない気持ちと、ちゃんと子育てしたい気持ちで揺れています。',
    },
    posts: [
      {
        post_type: 'before',
        concern_tags: ['子どものこと'],
        body: '28歳女性です。彼氏は子どもほしいと言っていて、私も嫌いじゃないんですが…正直仕事も諦めたくない。産後に職場復帰した先輩方、どれくらいのペースで戻りましたか？実際のところが知りたいです。',
      },
      {
        post_type: 'before',
        concern_tags: ['自分の気持ちが揺れている'],
        body: '「この人と結婚する」って確信を持てた瞬間ってありましたか？好きだし大切に思っているのに、なぜかまだ踏み出せない自分がいて。感覚的にわかるものですか？それとも論理的に考えて判断するもの？',
      },
    ],
  },
  // ── 追加・既婚 10人 ──
  {
    email: 'seed.koji@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: '浩二',
      gender: '男性',
      age: 35,
      user_type: 'married',
      current_age: 35,
      current_income: 720,
      current_household_income: 1050,
      current_savings: 580,
      current_kids_count: 1,
      current_note: '管理職になりました。子どもも生まれて毎日忙しいですが充実しています。',
    },
    senpai: {
      age_at_marriage: 31, partner_age_at_marriage: 29, income_at_marriage: 650, saving_at_marriage: 500,
      partner_income_at_marriage: 310, partner_saving_at_marriage: 280,
      cohabitation: 'no', cohabitation_period: null,
      area: '関西圏（大阪・京都・兵庫）', dating_period: '2〜3年',
      marriage_triggers: ['相手への安心感', '経済的な安定'],
      satisfaction: 4, current_status: '結婚継続中',
      reflection: '結婚してから生活が安定した。喧嘩も増えたが、乗り越えるたびに絆が深まる気がする。',
      message_to_undecided: '貯金は多いほど安心だけど、タイミングを逃すのが一番もったいない。',
      engagement_ring: 35, wedding_ring: 28, wedding_cost: 250, honeymoon_cost: 55,
      has_kids: 'yes', kids_count: 1, first_child_year: 3, first_child_saving: 350,
    },
    posts: [{
      post_type: 'married', concern_tags: ['家事・育児の分担'],
      body: '共働きなのに家事の分担がうまくいっていない。妻から「手伝うって言葉が嫌い」と言われて気づいた。「手伝う」ではなく「一緒にやる」という意識に変えるのが難しい。',
    }],
  },
  {
    email: 'seed.aya@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'あや',
      gender: '女性',
      age: 29,
      user_type: 'married',
      current_age: 29,
      current_income: 0,
      current_household_income: 580,
      current_savings: 220,
      current_kids_count: 1,
      current_note: '現在は専業主婦。子どもが1歳になりました。来年には復職を考えています。家計はギリギリですが何とかやっています。',
    },
    senpai: {
      age_at_marriage: 27, partner_age_at_marriage: 30, income_at_marriage: 350, saving_at_marriage: 280,
      partner_income_at_marriage: 580, partner_saving_at_marriage: 420,
      cohabitation: 'yes', cohabitation_period: '半年〜1年',
      area: '首都圏（東京・神奈川・埼玉・千葉）', dating_period: '1〜2年',
      marriage_triggers: ['年齢的なタイミング', '子どもが欲しい'],
      satisfaction: 5, current_status: '結婚継続中',
      reflection: '結婚は想像以上に楽しかった。二人でいると毎日が充実している。',
      message_to_undecided: '「好き」という気持ちより「信頼できる」かどうかを基準に。',
      engagement_ring: 28, wedding_ring: 20, wedding_cost: 200, honeymoon_cost: 30,
      has_kids: 'yes', kids_count: 1, first_child_year: 1, first_child_saving: 200,
    },
    posts: [{
      post_type: 'married', concern_tags: ['お金・家計'],
      body: '妊娠中に仕事を辞めてしまい、今は専業主婦。夫の収入だけで生活しているので毎月ギリギリです。同じ状況の方、家計のやりくりをどうしていますか？',
    }],
  },
  {
    email: 'seed.seiichi@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'せいいち',
      gender: '男性',
      age: 41,
      user_type: 'married',
      current_age: 41,
      current_income: 540,
      current_household_income: 1100,
      current_savings: 980,
      current_kids_count: 0,
      current_note: '夫婦関係は相変わらず課題があります。でも離婚には至っていません。二人でいることのメリットを改めて考え直しています。',
    },
    senpai: {
      age_at_marriage: 33, partner_age_at_marriage: 31, income_at_marriage: 480, saving_at_marriage: 600,
      partner_income_at_marriage: 400, partner_saving_at_marriage: 520,
      cohabitation: 'no', cohabitation_period: null,
      area: '東海（愛知・静岡・岐阜）', dating_period: '3〜5年',
      marriage_triggers: ['年齢的なタイミング', '周りの影響'],
      satisfaction: 2, current_status: '結婚継続中',
      reflection: '付き合い中と結婚後でこんなに変わるとは思わなかった。お互い素の自分が出てきてぶつかることが増えた。',
      message_to_undecided: '結婚は覚悟が必要。相手の嫌なところも全部受け入れる準備ができているか確認して。',
      engagement_ring: null, wedding_ring: 15, wedding_cost: null, honeymoon_cost: null,
      has_kids: 'no', kids_count: null, first_child_year: null, first_child_saving: null,
    },
    posts: [{
      post_type: 'married', concern_tags: ['コミュニケーション不足', '離婚を考えている'],
      body: '結婚8年目。最近は顔を合わせても会話がなく、同居しているだけの感覚です。離婚も頭をよぎるが、子どもがいないのでまだ踏み出せていない。同じような状況を乗り越えた方いますか？',
    }],
  },
  {
    email: 'seed.mika@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'みかりん',
      gender: '女性',
      age: 33,
      user_type: 'married',
      current_age: 33,
      current_income: 450,
      current_household_income: 950,
      current_savings: 380,
      current_kids_count: 1,
      current_note: '結婚3年目に第一子が誕生。育休中です。夫も育児に少しずつ慣れてきました。',
    },
    senpai: {
      age_at_marriage: 30, partner_age_at_marriage: 32, income_at_marriage: 420, saving_at_marriage: 350,
      partner_income_at_marriage: 460, partner_saving_at_marriage: 380,
      cohabitation: 'no', cohabitation_period: null,
      area: '首都圏（東京・神奈川・埼玉・千葉）', dating_period: '半年〜1年',
      marriage_triggers: ['相手への安心感', '勢いで'],
      satisfaction: 4, current_status: '結婚継続中',
      reflection: '交際期間が短くて不安だったが、結婚してから本当に分かり合えた気がする。一緒に生活してみてはじめて見えるものがある。',
      message_to_undecided: '交際期間の長さより、どれだけ本音で話せるかが大事。',
      engagement_ring: 22, wedding_ring: 18, wedding_cost: 180, honeymoon_cost: 28,
      has_kids: 'no', kids_count: null, first_child_year: null, first_child_saving: null,
    },
    posts: [{
      post_type: 'married', concern_tags: ['子育て'],
      body: '結婚3年目でやっと子どもができました。でも夫が育児にまったく参加しようとしない。「仕事が忙しい」と言われるが、私も仕事しながら全部やっている。育児参加を増やすいい方法ありますか？',
    }],
  },
  {
    email: 'seed.daisuke@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'だいちゃん',
      gender: '男性',
      age: 30,
      user_type: 'married',
      current_age: 30,
      current_income: 560,
      current_household_income: 750,
      current_savings: 280,
      current_kids_count: 1,
      current_note: '男性育休を無事取得できました！2ヶ月育休を取り、育児に積極的に参加しています。復帰後も早帰りを続けています。',
    },
    senpai: {
      age_at_marriage: 28, partner_age_at_marriage: 26, income_at_marriage: 520, saving_at_marriage: 300,
      partner_income_at_marriage: 290, partner_saving_at_marriage: 180,
      cohabitation: 'yes', cohabitation_period: '1〜2年',
      area: '関西圏（大阪・京都・兵庫）', dating_period: '2〜3年',
      marriage_triggers: ['子どもが欲しい', '相手への安心感'],
      satisfaction: 5, current_status: '結婚継続中',
      reflection: '毎日帰る場所があるのが嬉しい。妻の料理を楽しみに仕事できるようになった。',
      message_to_undecided: '「まだ早い」と思っていても、意外と何とかなる。踏み出す勇気だけ。',
      engagement_ring: 30, wedding_ring: 20, wedding_cost: 240, honeymoon_cost: 40,
      has_kids: 'yes', kids_count: 1, first_child_year: 2, first_child_saving: 250,
    },
    posts: [{
      post_type: 'married', concern_tags: ['仕事とのバランス'],
      body: '育休を取りたいと上司に相談したら「前例がない」と言われた。男性育休を取得した方、どのように会社を説得しましたか？同じ経験のある方に話を聞きたいです。',
    }],
  },
  {
    email: 'seed.sayaka@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'さやか',
      gender: '女性',
      age: 36,
      user_type: 'married',
      current_age: 36,
      current_income: 320,
      current_household_income: 1350,
      current_savings: 860,
      current_kids_count: 0,
      current_note: '義両親との同居問題は現在も話し合い中です。夫の収入が高いので経済的には安定しています。',
    },
    senpai: {
      age_at_marriage: 32, partner_age_at_marriage: 38, income_at_marriage: 280, saving_at_marriage: 700,
      partner_income_at_marriage: 750, partner_saving_at_marriage: 680,
      cohabitation: 'no', cohabitation_period: null,
      area: 'その他', dating_period: '1〜2年',
      marriage_triggers: ['年齢的なタイミング', '経済的な安定'],
      satisfaction: 3, current_status: '結婚継続中',
      reflection: '年齢差があるのでライフステージのズレを感じることがある。相手の定年後の生活も考えておけばよかった。',
      message_to_undecided: '年齢差があっても価値観が合えば大丈夫。でも老後の生活設計は早めに話し合って。',
      engagement_ring: 20, wedding_ring: 16, wedding_cost: null, honeymoon_cost: 35,
      has_kids: 'no', kids_count: null, first_child_year: null, first_child_saving: null,
    },
    posts: [{
      post_type: 'married', concern_tags: ['義実家・親族関係'],
      body: '夫が長男で、義両親の老後を同居でという話が出てきた。私は正直乗り気ではないけど断りにくい空気がある。同居を経験された方、実際どうでしたか？',
    }],
  },
  {
    email: 'seed.takuya2@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'たく28',
      gender: '男性',
      age: 28,
      user_type: 'married',
      current_age: 28,
      current_income: 500,
      current_household_income: 680,
      current_savings: 160,
      current_kids_count: 1,
      current_note: '家計は厳しいですが、二人で協力して乗り切っています。貯金を少しずつ増やし中。子どもが生まれてからお金の使い方を見直しました。',
    },
    senpai: {
      age_at_marriage: 26, partner_age_at_marriage: 25, income_at_marriage: 450, saving_at_marriage: 220,
      partner_income_at_marriage: 280, partner_saving_at_marriage: 120,
      cohabitation: 'yes', cohabitation_period: '半年〜1年',
      area: '首都圏（東京・神奈川・埼玉・千葉）', dating_period: '3〜5年',
      marriage_triggers: ['相手への安心感', '子どもが欲しい'],
      satisfaction: 4, current_status: '結婚継続中',
      reflection: '20代での結婚は正解だった。若いうちに一緒に成長できるのが良かった。',
      message_to_undecided: '若いうちの結婚は貯金が少なくても二人で積み上げる楽しさがある。',
      engagement_ring: 20, wedding_ring: 15, wedding_cost: 150, honeymoon_cost: 22,
      has_kids: 'yes', kids_count: 1, first_child_year: 1, first_child_saving: 150,
    },
    posts: [{
      post_type: 'married', concern_tags: ['お金・家計'],
      body: '26歳で結婚して貯金が200万しかなかった。子どもが生まれた今思うのは、もう少し貯めてから結婚すれば良かったということ。でも後悔はしていない。若い夫婦の家計管理のコツを教えてほしい。',
    }],
  },
  {
    email: 'seed.keiko@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'けいこ',
      gender: '女性',
      age: 32,
      user_type: 'married',
      current_age: 32,
      current_income: 410,
      current_household_income: 970,
      current_savings: 420,
      current_kids_count: 2,
      current_note: '二人目が生まれて大変ですが、夫が協力的なので乗り切れています。夫婦の連携がより深まった気がします。',
    },
    senpai: {
      age_at_marriage: 29, partner_age_at_marriage: 31, income_at_marriage: 380, saving_at_marriage: 400,
      partner_income_at_marriage: 520, partner_saving_at_marriage: 350,
      cohabitation: 'yes', cohabitation_period: '6ヶ月〜1年',
      area: '関西圏（大阪・京都・兵庫）', dating_period: '2〜3年',
      marriage_triggers: ['相手への安心感', '年齢的なタイミング'],
      satisfaction: 5, current_status: '結婚継続中',
      reflection: '夫がとても協力的で毎日感謝している。結婚相手の選択が人生の大部分を決めると実感。',
      message_to_undecided: '相手のことを親友のように話せるかどうかが一番のポイントだと思います。',
      engagement_ring: 32, wedding_ring: 24, wedding_cost: 260, honeymoon_cost: 42,
      has_kids: 'yes', kids_count: 2, first_child_year: 2, first_child_saving: 350,
    },
    posts: [{
      post_type: 'married', concern_tags: ['子育て'],
      body: '二人目を授かりました。上の子のイヤイヤ期と重なって毎日ヘトヘトです。年子・年齢差が近いお子さんをお持ちの方、どうやって乗り越えましたか？先が見えなくて泣きそうです。',
    }],
  },
  {
    email: 'seed.hiroshi@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'ひろし',
      gender: '男性',
      age: 38,
      user_type: 'married',
      current_age: 38,
      current_income: 590,
      current_household_income: 1420,
      current_savings: 1100,
      current_kids_count: 0,
      current_note: '妻の収入との差は縮まってきました。共働きで貯金は増えています。子どもはもうしばらく考えていません。',
    },
    senpai: {
      age_at_marriage: 34, partner_age_at_marriage: 33, income_at_marriage: 530, saving_at_marriage: 850,
      partner_income_at_marriage: 680, partner_saving_at_marriage: 490,
      cohabitation: 'no', cohabitation_period: null,
      area: '東海（愛知・静岡・岐阜）', dating_period: '1〜2年',
      marriage_triggers: ['年齢的なタイミング', '経済的な安定'],
      satisfaction: 3, current_status: '結婚継続中',
      reflection: '共働きだが妻の方が稼ぎが多い。最初は複雑な気持ちだったが、今は素直に尊敬している。',
      message_to_undecided: '収入の差は気にしすぎないで。家庭内の役割分担は話し合いで決めればいい。',
      engagement_ring: null, wedding_ring: 18, wedding_cost: null, honeymoon_cost: 30,
      has_kids: 'no', kids_count: null, first_child_year: null, first_child_saving: null,
    },
    posts: [{
      post_type: 'married', concern_tags: ['コミュニケーション不足'],
      body: '妻の方が収入が高く、ここ最近それがプレッシャーになっている。妻は何も言わないが、なんとなく肩身が狭い。同じような状況の方いますか？どう折り合いをつけていますか？',
    }],
  },
  {
    email: 'seed.midori@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'みどり',
      gender: '女性',
      age: 27,
      user_type: 'married',
      current_age: 27,
      current_income: 340,
      current_household_income: 720,
      current_savings: 250,
      current_kids_count: 0,
      current_note: '少しずつ二人の生活が安定してきました。来年には子どもも考えています。若いなりに楽しくやっています。',
    },
    senpai: {
      age_at_marriage: 25, partner_age_at_marriage: 27, income_at_marriage: 310, saving_at_marriage: 180,
      partner_income_at_marriage: 350, partner_saving_at_marriage: 180,
      cohabitation: 'yes', cohabitation_period: '半年〜1年',
      area: '首都圏（東京・神奈川・埼玉・千葉）', dating_period: '半年〜1年',
      marriage_triggers: ['勢いで', '相手への安心感'],
      satisfaction: 4, current_status: '結婚継続中',
      reflection: '若くして結婚したが今のところ後悔なし。お金はないけど笑いが絶えない毎日。',
      message_to_undecided: 'お金より気持ち。25歳で結婚して毎日楽しいです。',
      engagement_ring: 15, wedding_ring: 12, wedding_cost: 120, honeymoon_cost: 18,
      has_kids: 'no', kids_count: null, first_child_year: null, first_child_saving: null,
    },
    posts: [{
      post_type: 'married', concern_tags: ['お金・家計'],
      body: '25歳で結婚して貯金合計200万でスタートしました。周りから「若すぎる」と言われましたが後悔なし。ただやっぱりお金の不安はあります。同じく若く結婚した方々、乗り越えてますか？',
    }],
  },

  // ── 追加・結婚前 10人 ──
  {
    email: 'seed.yuki2@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'ゆうき', gender: '男性', age: 24, user_type: 'before',
      anxiety_level: 3, concern_tags: ['お金・貯金が不安', '親への紹介・挨拶'],
      needed_savings: 300, ring_budget: 20, work_plan: 'ふたりとも正社員継続', kids_plan: 'ほしい',
      worry_note: '親への挨拶に向けて準備中です。礼儀をしっかりしたいと思います。彼女の親が厳しそうで緊張しています。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['親への紹介・挨拶'],
      body: '付き合って8ヶ月、そろそろ親に紹介したいと思っています。彼女の親に挨拶するタイミングや、話す内容など経験談を聞かせてください。緊張しています。',
    }],
  },
  {
    email: 'seed.nana@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'なな', gender: '女性', age: 27, user_type: 'before',
      anxiety_level: 4, concern_tags: ['相手との温度差', 'タイミングがわからない'],
      needed_savings: 350, ring_budget: 25, work_plan: 'ふたりとも正社員継続', kids_plan: 'まだわからない',
      worry_note: '彼との結婚の話し合いを少しずつ進めています。温度差は縮まってきた気がしますが、まだ不安です。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['相手との温度差'],
      body: '付き合って2年。私は結婚を意識しているのに彼は「まだいいかな」という感じ。温度差を感じていて不安です。どうやってこの差を縮めましたか？',
    }],
  },
  {
    email: 'seed.shota@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'しょーた', gender: '男性', age: 30, user_type: 'before',
      anxiety_level: 2, concern_tags: ['そもそも結婚すべきか', '住む場所'],
      needed_savings: 600, ring_budget: 30, work_plan: 'ふたりとも正社員継続', kids_plan: 'ほしくない',
      worry_note: 'お互いの生活拠点をどうするか、まだ答えが出ていません。どちらかが折れるしかないのかなと思い始めています。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['住む場所'],
      body: '彼女は地元（九州）で暮らしたい、自分は東京の仕事を続けたい。どちらが折れるかでもめています。遠距離から結婚した方、どう解決しましたか？',
    }],
  },
  {
    email: 'seed.misaki2@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'みさき', gender: '女性', age: 25, user_type: 'before',
      anxiety_level: 5, concern_tags: ['お金・貯金が不安', '相手の収入が不安'],
      needed_savings: 500, ring_budget: 20, work_plan: '自分が時短・パートに', kids_plan: 'ほしい',
      worry_note: '相手の収入よりも、一緒に頑張れるかどうかを重視しようと思い始めています。でもやっぱりお金の不安はゼロにはなりません。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['相手の収入が不安'],
      body: '彼氏の年収が280万で、結婚を本気で考えると不安になります。私も正社員ですが子どもができたら…と考えると踏み出せない。年収低い状態で結婚された方、実際どうでしたか？',
    }],
  },
  {
    email: 'seed.akira@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'あきら', gender: '男性', age: 29, user_type: 'before',
      anxiety_level: 3, concern_tags: ['性の不一致・相性が不安', '自分の気持ちが揺れている'],
      needed_savings: 400, ring_budget: 35, work_plan: 'ふたりとも正社員継続', kids_plan: 'まだわからない',
      worry_note: '自分の中で結婚への不安と向き合っています。彼女は大切だけど、「結婚」という言葉がまだ現実感を帯びない。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['自分の気持ちが揺れている'],
      body: '彼女のことは好きだし大切だと思う。でも「結婚」となると急に自信がなくなる。これは普通のことですか？決断できた方はどんなきっかけがありましたか？',
    }],
  },
  {
    email: 'seed.yumi@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'ゆみ', gender: '女性', age: 31, user_type: 'before',
      anxiety_level: 2, concern_tags: ['仕事とのバランス', 'そもそも結婚すべきか'],
      needed_savings: 500, ring_budget: 30, work_plan: 'ふたりとも正社員継続', kids_plan: 'ほしくない',
      worry_note: 'キャリアと結婚、どちらかを選ぶ必要はないはずだと自分に言い聞かせています。両立している先輩の話をもっと聞きたい。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['仕事とのバランス'],
      body: '31歳、キャリアが面白くなってきたタイミングで結婚の話が出てきた。仕事を続けながら結婚生活をうまくやれているか不安。両立している方のリアルな話が聞きたいです。',
    }],
  },
  {
    email: 'seed.kenichi@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'けんいち', gender: '男性', age: 27, user_type: 'before',
      anxiety_level: 4, concern_tags: ['お金・貯金が不安', 'そもそも結婚すべきか'],
      needed_savings: 400, ring_budget: 30, work_plan: 'ふたりとも正社員継続', kids_plan: 'ほしい',
      worry_note: 'まずは二人で将来についてしっかり話し合いたいと思います。結婚のメリットを実感している人の話を聞いてみたい。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['そもそも結婚すべきか'],
      body: '27歳、正直結婚のメリットがよくわからない。今の同棲生活で十分じゃないかと思ってしまう。既婚の先輩方、「結婚してよかった」と感じる瞬間はどんなときですか？',
    }],
  },
  {
    email: 'seed.rei@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'れい', gender: '女性', age: 26, user_type: 'before',
      anxiety_level: 3, concern_tags: ['子どものこと', '相手との温度差'],
      needed_savings: 300, ring_budget: 25, work_plan: '自分が時短・パートに', kids_plan: 'ほしい',
      worry_note: '子どもについての価値観の違いを少しずつ埋めていきたいです。彼氏と何度も話し合っています。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['子どものこと'],
      body: '26歳で子どもがほしい気持ちはあるが、彼氏がまだいらないと言っている。子どもの話し合いって結婚前にしっかりできましたか？どのくらい大事な話し合いでしたか？',
    }],
  },
  {
    email: 'seed.kosuke@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'こうすけ', gender: '男性', age: 32, user_type: 'before',
      anxiety_level: 2, concern_tags: ['タイミングがわからない', '親への紹介・挨拶'],
      needed_savings: 700, ring_budget: 40, work_plan: 'ふたりとも正社員継続', kids_plan: 'まだわからない',
      worry_note: '何かが欠けているのではなく、ただ踏み出す勇気が必要なのかもしれません。彼女と真剣に話し合う機会を作ろうと思っています。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['タイミングがわからない'],
      body: '32歳、貯金800万あって収入も安定している。客観的には「結婚できる状況」なのに、なぜか一歩が踏み出せない。準備が整っているのに動けない方いますか？',
    }],
  },
  {
    email: 'seed.maika@marilog.test',
    password: 'testpass123',
    profile: {
      nickname: 'まいか', gender: '女性', age: 24, user_type: 'before',
      anxiety_level: 4, concern_tags: ['お金・貯金が不安', 'タイミングがわからない'],
      needed_savings: 300, ring_budget: 20, work_plan: 'ふたりとも正社員継続', kids_plan: 'ほしい',
      worry_note: '貯金を頑張りながら、彼氏と将来の計画を少しずつ立てています。社会人2年目で先輩たちの話がとても参考になります。',
    },
    posts: [{
      post_type: 'before', concern_tags: ['お金・貯金が不安'],
      body: '24歳・貯金80万・社会人2年目です。彼氏と将来の話をしているんですが、お互い貯金が少なすぎて不安。若い内に結婚した方、どんな状況でスタートしましたか？',
    }],
  },
]

// ────────────────────────────
// コメント定義（作成後に ID が決まるので関数で定義）
// ────────────────────────────
function buildComments(userIds, postIds) {
  // userIds: { misaki, kenta, yuri, takuya, sakura }
  // postIds: { misaki: [postId0, postId1], kenta: [...], ... }
  return [
    {
      post_id: postIds.misaki[0], // 美咲の家事分担投稿
      user_id: userIds.kenta,
      body: '家事分担は本当に大事ですよね。うちは結婚当初に家事リストを作って、得意不得意で分担しました。最初は話し合いが面倒でしたが、今は自然に回っています。一度紙に書き出してみるのがおすすめです。',
    },
    {
      post_id: postIds.misaki[1], // 美咲の義実家投稿
      user_id: userIds.yuri,
      body: '同じ経験があります。私は夫に「来る前日に教えてほしい、心の準備がいる」と正直に話しました。最初は夫もびっくりしてましたが、少しずつ気を使ってくれるようになりましたよ。',
    },
    {
      post_id: postIds.takuya[0], // 拓也の貯金投稿
      user_id: userIds.misaki,
      body: '私が結婚した時の貯金は200万くらいでした。二人合わせて500万あれば十分という感じでしたよ。貯金額より、お金の使い方の価値観が合っているかの方が大事だと思います。',
    },
    {
      post_id: postIds.takuya[1], // 拓也のタイミング投稿
      user_id: userIds.yuri,
      body: 'うちは私から言い出してしまいました笑。「そろそろどうする？」って雰囲気になったら、男性から切り出してあげてほしいです。女性はずっと待ってますよ。',
    },
    {
      post_id: postIds.sakura[1], // さくらの気持ちが揺れている投稿
      user_id: userIds.kenta,
      body: '「確信」を持てた瞬間、正直よくわかりません笑。気づいたら「この人以外考えられない」という感じになっていた気がします。あまり考えすぎず、一緒にいて楽しいかどうかを基準にしてみては。',
    },
  ]
}

// ────────────────────────────
// メイン処理
// ────────────────────────────
async function main() {
  console.log('🌱 MARILOGダミーデータ投入を開始します...\n')

  const userIds = {}
  const postIds = {}

  // 1. 既存のシードユーザーを削除
  console.log('🗑️  既存のシードユーザーを確認・削除中...')
  for (const u of USERS) {
    const { data: existing } = await supabase.auth.admin.listUsers()
    const found = existing?.users?.find(eu => eu.email === u.email)
    if (found) {
      await supabase.auth.admin.deleteUser(found.id)
      console.log(`   削除: ${u.email}`)
    }
  }

  // 2. ユーザー作成 → プロフィール・投稿を順番に作成
  const userKeys = [
    'misaki', 'kenta', 'yuri', 'takuya', 'sakura',
    'koji', 'aya', 'seiichi', 'mika', 'daisuke', 'sayaka', 'takuya2', 'keiko', 'hiroshi', 'midori',
    'yuki2', 'nana', 'shota', 'misaki2', 'akira', 'yumi', 'kenichi', 'rei', 'kosuke', 'maika',
  ]

  for (let i = 0; i < USERS.length; i++) {
    const u = USERS[i]
    const key = userKeys[i]
    console.log(`\n👤 ${u.profile.nickname} を作成中...`)

    // 2a. auth ユーザー作成
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    })
    if (authErr) { console.error(`   ❌ auth エラー:`, authErr.message); continue }
    const uid = authData.user.id
    userIds[key] = uid
    console.log(`   ✅ auth ユーザー作成 (${uid.slice(0, 8)}...)`)

    // 2b. プロフィール挿入
    const profileRow = {
      id: uid,
      nickname: u.profile.nickname,
      gender: u.profile.gender,
      age: u.profile.age,
      user_type: u.profile.user_type,
      updated_at: new Date().toISOString(),
    }
    if (u.profile.user_type === 'before') {
      Object.assign(profileRow, {
        anxiety_level: u.profile.anxiety_level ?? null,
        concern_tags: u.profile.concern_tags ?? [],
        needed_savings: u.profile.needed_savings ?? null,
        ring_budget: u.profile.ring_budget ?? null,
        work_plan: u.profile.work_plan ?? null,
        kids_plan: u.profile.kids_plan ?? null,
        worry_note: u.profile.worry_note ?? null,
      })
    }
    if (u.profile.user_type === 'married') {
      Object.assign(profileRow, {
        current_age: u.profile.current_age ?? null,
        current_income: u.profile.current_income ?? null,
        current_household_income: u.profile.current_household_income ?? null,
        current_savings: u.profile.current_savings ?? null,
        current_kids_count: u.profile.current_kids_count ?? null,
        current_note: u.profile.current_note ?? null,
      })
    }
    const { error: profileErr } = await supabase.from('profiles').insert(profileRow)
    if (profileErr) console.error(`   ❌ プロフィールエラー:`, profileErr.message)
    else console.log(`   ✅ プロフィール作成`)

    // 2c. 先輩プロフィール（既婚のみ）
    if (u.senpai) {
      const { error: senpaiErr } = await supabase.from('senpai_profiles').insert({
        user_id: uid,
        ...u.senpai,
      })
      if (senpaiErr) console.error(`   ❌ 先輩プロフィールエラー:`, senpaiErr.message)
      else console.log(`   ✅ 先輩プロフィール作成`)
    }

    // 2d. 投稿
    postIds[key] = []
    for (const post of u.posts) {
      const { data: postData, error: postErr } = await supabase
        .from('posts')
        .insert({ user_id: uid, ...post })
        .select('id')
        .single()
      if (postErr) {
        console.error(`   ❌ 投稿エラー:`, postErr.message)
        postIds[key].push(null)
      } else {
        postIds[key].push(postData.id)
        console.log(`   ✅ 投稿作成: 「${post.body.slice(0, 20)}...」`)
      }
    }
  }

  // 3. コメント作成
  console.log('\n💬 コメントを作成中...')
  const comments = buildComments(userIds, postIds)
  const commentIds = {}

  for (const c of comments) {
    if (!c.post_id || !c.user_id) { console.warn('   ⚠️  post_id or user_id が null のためスキップ'); continue }
    const { data: commentData, error: commentErr } = await supabase
      .from('comments')
      .insert(c)
      .select('id')
      .single()
    if (commentErr) console.error(`   ❌ コメントエラー:`, commentErr.message)
    else {
      const cKey = `${c.user_id}_${c.post_id}`
      commentIds[cKey] = commentData.id
      console.log(`   ✅ コメント作成`)
    }
  }

  // 4. いいね追加
  console.log('\n👍 いいねを追加中...')

  // けんたのコメント（美咲の投稿）→ 美咲がいいね
  const kentaOnMisaki0Key = `${userIds.kenta}_${postIds.misaki?.[0]}`
  if (commentIds[kentaOnMisaki0Key] && userIds.misaki) {
    const { error } = await supabase.from('comment_likes').insert({
      comment_id: commentIds[kentaOnMisaki0Key],
      user_id: userIds.misaki,
    })
    if (!error) console.log('   ✅ 美咲 → けんたのコメントにいいね')
    else console.error('   ❌ いいねエラー:', error.message)
  }

  // けんたのコメント（美咲の投稿）→ さくらがいいね
  if (commentIds[kentaOnMisaki0Key] && userIds.sakura) {
    const { error } = await supabase.from('comment_likes').insert({
      comment_id: commentIds[kentaOnMisaki0Key],
      user_id: userIds.sakura,
    })
    if (!error) console.log('   ✅ さくら → けんたのコメントにいいね')
    else console.error('   ❌ いいねエラー:', error.message)
  }

  // 美咲のコメント（拓也の投稿）→ 拓也がいいね
  const misakiOnTakuya0Key = `${userIds.misaki}_${postIds.takuya?.[0]}`
  if (commentIds[misakiOnTakuya0Key] && userIds.takuya) {
    const { error } = await supabase.from('comment_likes').insert({
      comment_id: commentIds[misakiOnTakuya0Key],
      user_id: userIds.takuya,
    })
    if (!error) console.log('   ✅ 拓也 → 美咲のコメントにいいね')
    else console.error('   ❌ いいねエラー:', error.message)
  }

  // ゆりのコメント（拓也の投稿）→ さくらがいいね
  const yuriOnTakuya1Key = `${userIds.yuri}_${postIds.takuya?.[1]}`
  if (commentIds[yuriOnTakuya1Key] && userIds.sakura) {
    const { error } = await supabase.from('comment_likes').insert({
      comment_id: commentIds[yuriOnTakuya1Key],
      user_id: userIds.sakura,
    })
    if (!error) console.log('   ✅ さくら → ゆりのコメントにいいね')
    else console.error('   ❌ いいねエラー:', error.message)
  }

  console.log('\n🎉 シード完了！')
  console.log('\n📋 ログイン情報:')
  for (const u of USERS) {
    console.log(`   ${u.email}  /  ${u.password}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
