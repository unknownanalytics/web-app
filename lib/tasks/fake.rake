# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# The rake task to upload the bank excel file into the branch table
namespace :fake do
  referrals = %w(yahoo google facebook twitter linkedin another)
  desc "Fake page views"
  task page_views: :environment do
    pages = Page.all
    5000.times do
      is_mobile = rand(2) == 1 ? true : false
      is_desktop = !is_mobile
      pv = PageView.create(
          page_id: pages[rand(pages.length)].id,
          is_desktop: is_desktop,
          is_mobile: is_mobile,
          utm_source: referrals[rand(0..5)]
      )
      print "Page created with #{pv.id}  parent  #{pv.page_id} \n"
    end
    desc 'created pages finished'
  end

  task page___views_geo: :environment do
    coutries = %w(AF AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CD CG CK CR HR CU CW CY CZ CI DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA MK RO RU RW RE BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB UM US UY UZ VU VE VN VG VI WF EH YE ZM ZW AX)
    pages = PageVi.all
    50000.times do
      pv = PageViewLocation.create(
          page_id: pages[rand(pages.length)].id,
          country_iso_2: coutries[rand(coutries.length)]
      )
      print "Page location created with #{pv.id}  parent  #{pv.page_id} \n"
    end
    desc 'created pages finished'
  end

  task page_views_geo: :environment do
    coutries = %w(AF AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CD CG CK CR HR CU CW CY CZ CI DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA MK RO RU RW RE BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB UM US UY UZ VU VE VN VG VI WF EH YE ZM ZW AX)
    view = PageViewLocation.all
    view.each do |item|
      item.country_iso_2 = coutries[rand(coutries.length)]
      print "updated to #{item.country_iso_2}"
      item.save!
    end
    desc 'created pages finished'
  end
end