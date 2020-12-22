class Api::Ext::V1::ViewsController < Api::ApiController
  def index
    reply_json({
                   ok: true
               })
  end
end
