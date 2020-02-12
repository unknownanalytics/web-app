class Hooks::HeatmapsController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => [:screenshot, :screenshot_heat]
  # remove
  # called from the screen shot app
  def screenshot
    secret = params[:app_token]
    puts params
    if secret.present? && !secret.nil? && secret === ENV['UNK_ANA_SCREENSHOT_SECRET_KEY']
      data = screenshot_body_params
      page_id = data[:page_id]
      resolution = data[:resolution]
      screenshot_path = data[:screenshot_path]
      thumbnail_path = data[:thumbnail_path]
      if Page.exists?(page_id)
        PageUrlScreenshot.create!({
                                      page_id: page_id,
                                      screenshot_path: screenshot_path,
                                      thumbnail_path: thumbnail_path
                                  })
        reply_json({ok: true})
      else
        reply_json({ok: false}, 404)
      end
    else
      reply_json({ok: false}, 401)
    end
  end

  # remove
  # called from the screen shot app
  def screenshot_heat
    secret = params[:token]
    if secret.present? && !secret.nil? && secret === ENV['UNK_ANA_SCREENSHOT_SECRET_KEY']
      PageUrlScreenshot.find()
      resolution = data[:resolution]
      path = data[:path]
      if Page.exists?(page_id)
        PageUrlScreenshot.create!({
                                      page_id: page_id,
                                      screenshot_path: path,
                                  })
        reply_json({ok: true})
      else
        reply_json({ok: false}, 404)
      end
    else
      reply_json({ok: false}, 401)
    end
  end

  private

  def screenshot_body_params
    params.permit(:page_id, :resolution, :screenshot_path, :thumbnail_path,  :token)
  end
end
