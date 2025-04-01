from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

from nba_api.stats.endpoints import commonplayerinfo, playercareerstats
from nba_api.stats.static import players

app = Flask(__name__)
CORS(app)

@app.route('/api/get_test_data', methods=['GET'])
def add_user():
    return jsonify({"data": "Hello World"}), 200


def get_player_career_data(player_name):
    # Step 1: Search for player by name
    player_list = players.find_players_by_full_name(player_name)
    
    if not player_list:
        return {"error": f"Player '{player_name}' not found."}

    # Step 2: Get player ID from the search result
    player_id = player_list[0]['id']
    
    # Step 3: Fetch career stats using the player ID
    career_data = playercareerstats.PlayerCareerStats(player_id=player_id)
    
    # Step 4: Return the career data as a JSON dict
    career_json = career_data.get_data_frames()[0].to_dict(orient='records')
    
    return career_json

# Example usage:
player_name = "LeBron James"
career_data = get_player_career_data(player_name)

# Run flask app
if __name__ == '__main__':
    app.run(debug=True)