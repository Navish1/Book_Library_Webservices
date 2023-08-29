<?php
if (isset($_POST['submit'])) {
    $keyword = $_POST['keyword'];

    if (empty($keyword)) {
        $response = array(
            "type" => "error",
            "message" => "Please enter the search phrase."
        );
    } else {
        $apikey = 'AIzaSyCScG9HuiFEDqPz5vKZSMxTNTTtJssnJmI';
        $phrase = urlencode($keyword);
        $googleApiUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' . $phrase . '&maxResults=10&key=' . $apikey;

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $googleApiUrl);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_VERBOSE, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);

        curl_close($ch);
        $data = json_decode($response);
        $videos = $data->items;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouTube Video Search Results</title>
</head>
<body>
    <?php if (isset($videos)) { ?>
        <div class="result-heading"><?php echo count($videos); ?> Results</div>
        <div class="videos-data-container" id="SearchResultsDiv">
            <?php foreach ($videos as $video) { ?>
                <div class="video-tile">
                    <div class="videoDiv">
                        <iframe id="iframe" style="width:100%;height:100%" src="//www.youtube.com/embed/<?php echo $video->id->videoId; ?>" 
data-autoplay-src="//www.youtube.com/embed/<?php echo $video->id->videoId; ?>?autoplay=1"></iframe>         
                    </div>
                    <div class="videoInfo">
                        <div class="videoTitle"><b><?php echo $video->snippet->title; ?></b></div>
                        <div class="videoDesc"><?php echo $video->snippet->description; ?></div>
                    </div>
                </div>
            <?php } ?>
        </div>
    <?php } elseif (isset($response)) { ?>
        <div class="response <?php echo $response["type"]; ?>"><?php echo $response["message"]; ?></div>
    <?php } ?>
</body>
</html>
