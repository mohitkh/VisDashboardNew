from flask import Flask, render_template, jsonify, request
from flask_cors import CORS, cross_origin
import utils as util
app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/getData', methods=['GET'])
@cross_origin(supports_credentials=True)
def sendConsolidatedData():
    print(request.query_string)
    countryId=request.args.get('countryId')
    barX=request.args.get('barX')
    barY=request.args.get('barY')
    xSubCategory=request.args.get('xSubCategory')
    return jsonify(util.formResponse(countryId,barX,barY,xSubCategory))

@app.route('/getScatterPlotData', methods=['GET'])
@cross_origin(supports_credentials=True)
def sendScatterPlotClusteredData():
    print(request.query_string)
    countryId=request.args.get('countryId')
    barX=request.args.get('barX')
    barY=request.args.get('barY')
    xSubCategory=request.args.get('xSubCategory')
    return jsonify(util.formScatterPlotResponse(countryId,barX,barY,xSubCategory))


if __name__ == '__main__':
    app.run(debug=True)